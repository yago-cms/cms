<?php

namespace Yago\Cms\View\Components\Blocks;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\View;
use Illuminate\View\Component;

class Card extends Component
{
    public $block;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($block)
    {
        $this->block = $block;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        $content = json_decode($this->block['content']);

        if (!$content) {
            return null;
        }

        $cardTemplates = config('cardTemplates');
        $card = null;

        foreach ($cardTemplates as $cardTemplate) {
            if ($cardTemplate['id'] == $content->template) {
                $config = json_decode($cardTemplate['config']);
                $data = [];

                foreach ($config as $item) {
                    if (isset($content->{$item->id})) {
                        $fields = [];
                        if (isset($item->fields)) {
                            $fields = json_decode(json_encode($item->fields), true);
                        }
                        $data[] = [
                            'type' => $item->type,
                            'content' => $content->{$item->id},
                            'fields' => $fields,
                            'id' => $item->id
                        ];
                    }
                }

                $card = [
                    'key' => $cardTemplate['key'],
                    'data' => $data,
                ];
            }
        }

        if (!$card) {
            return;
        }

        $component = "cards.{$card['key']}";

        if (!View::exists('components.' . $component)) {
            $component = 'yago-cms::cards.default';
        }

        return view('yago-cms::components.blocks.card', [
            'card' => $card,
            'component' => "{$component}",
        ]);
    }
}
