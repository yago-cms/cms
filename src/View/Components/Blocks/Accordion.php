<?php

namespace Yago\Cms\View\Components\Blocks;

use Illuminate\Support\Facades\View;
use Illuminate\View\Component;

class Accordion extends Component
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

        if ($content->type == 'card') {
            $cardTemplates = config('cardTemplates');
            $cards = null;
            $cardTemplateKey = null;

            foreach ($cardTemplates as $cardTemplate) {
                if ($cardTemplate['id'] == $content->cardTemplate) {
                    $config = json_decode($cardTemplate['config']);
                    $cardTemplateKey = $cardTemplate['key'];

                    foreach ($content->cards as $card) {
                        $data = [];

                        foreach ($config as $item) {
                            if (isset($card->{$item->id})) {
                                $fields = [];

                                if (isset($item->fields)) {
                                    $fields = json_decode(json_encode($item->fields), true);
                                }

                                $data[] = [
                                    'type' => $item->type,
                                    'content' => $card->{$item->id},
                                    'fields' => $fields,
                                    'id' => $item->id,
                                ];
                            }
                        }

                        $cards[] = [
                            'data' => $data,
                            'label' => $card->label,
                        ];
                    }
                }
            }

            if (!$cards) {
                return;
            }

            $cardComponent = "cards.{$cardTemplateKey}";

            if (!View::exists('components.' . $cardComponent)) {
                $cardComponent = 'yago-cms::cards.default';
            }

            return view('yago-cms::components.blocks.accordion', compact('content', 'cards', 'cardComponent'));
        }

        return view('yago-cms::components.blocks.accordion', compact('content'));
    }
}
