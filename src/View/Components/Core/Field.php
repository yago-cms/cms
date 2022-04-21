<?php

namespace Yago\Cms\View\Components\Core;

use Illuminate\View\Component;

class Field extends Component
{
    public $fields;

    public $fieldKey;

    public $column;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($data, $fieldKey, $column = null)
    {
        $this->fields = $data['fields'];
        $this->fieldKey = $fieldKey;
        $this->column = $column;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        $blocks = [];

        foreach ($this->fields as $field) {
            if ($field['key'] == $this->fieldKey) {
                if ($this->column !== null) {
                    foreach ($field['fieldBlocks'] as $block) {
                        if ($block['column'] == $this->column) {
                            $blocks[] = $block;
                        }
                    }
                } else {
                    $blocks = $field['fieldBlocks'];
                }

                break;
            }
        }

        return view('yago-cms::components.core.block-list', compact('blocks'));
    }
}
