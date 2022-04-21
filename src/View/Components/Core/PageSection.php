<?php

namespace Yago\Cms\View\Components\Core;

use Illuminate\View\Component;

class PageSection extends Component
{
    public $pageSections;

    public $pageSectionName;

    public $column;

    public $fields;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($data, $pageSectionName, $column = null)
    {
        $this->pageSections = $data['pageSections'];
        $this->pageSectionName = $pageSectionName;
        $this->column = $column;
        $this->fields = $data['fields'];
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        $blocks = [];

        foreach ($this->pageSections as $pageSection) {
            if ($pageSection['name'] == $this->pageSectionName) {
                if ($this->column !== null) {
                    foreach ($pageSection['pageBlocks'] as $block) {
                        if ($block['column'] == $this->column) {
                            $blocks[] = $block;
                        }
                    }
                } else {
                    $blocks = $pageSection['pageBlocks'];
                }

                break;
            }
        }

        return view('yago-cms::components.core.block-list', compact('blocks'));
    }
}
