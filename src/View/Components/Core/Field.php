<?php

namespace Yago\Cms\View\Components\Core;

use Illuminate\Http\Request;
use Illuminate\View\Component;
use Yago\Cms\Services\ModuleService;

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
        $blocks = collect([]);

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

        $blocks = $blocks->sortBy('sorting');

        $moduleService = app()->make(ModuleService::class);
        $moduleBlocks = $moduleService->getBlocks();

        foreach ($blocks as &$block) {
            foreach ($moduleBlocks as $moduleBlock) {
                if ($block['type'] == $moduleBlock['type']) {
                    $controller = $moduleBlock['method'][0];
                    $action = $moduleBlock['method'][1];

                    session([
                        'config' => $block['content'],
                        'segment' => null,
                    ]);

                    $route = app('router')->getRoutes()->getByAction("{$controller}@{$action}");

                    if (!$route) {
                        abort(500, "Route not found for \"{$controller}@{$action}\".");
                    }

                    $request = Request::create($route->uri, 'GET');
                    $response = app()->handle($request);
                    $responseBody = $response->getContent();

                    $block['view'] = $responseBody;

                    break;
                }
            }
        }
        unset($block);

        return view('yago-cms::components.core.block-list', compact('blocks'));
    }
}
