<?php

namespace Yago\Cms\View\Components\Blocks;

use Illuminate\Http\Request;
use Illuminate\View\Component;
use Yago\Cms\Services\ModuleService;

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
