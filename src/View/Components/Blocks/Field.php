<?php

namespace Yago\Cms\View\Components\Blocks;

use Illuminate\View\Component;

class Field extends Component
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

        $blocks = [];

        $fields = view()->getConsumableComponentData('fields');

        foreach ($fields as $field) {
            if ($field['key'] == $content->field) {
                $blocks = $field['fieldBlocks'];
                break;
            }
        }

        return view('yago-cms::components.core.block-list', compact('blocks'));
    }
}
