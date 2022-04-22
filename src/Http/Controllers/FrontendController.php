<?php

namespace Yago\Cms\Http\Controllers;

use Yago\Cms\Helpers\ModuleHelper;
use Yago\Cms\Models\CardTemplate;
use Yago\Cms\Models\Field;
use Yago\Cms\Models\Page;
use Yago\Cms\Models\PageRevision;
use Yago\Cms\Models\Settings;
use Yago\Cms\Services\AbstractDataProviderService;
use Yago\Cms\Services\ModuleService;
use Illuminate\Support\Str;

class FrontendController extends Controller
{
    protected $moduleService;

    public function __construct(ModuleService $moduleService)
    {
        $this->moduleService = $moduleService;
    }

    public function index()
    {
        return $this->getPage();
    }

    public function getPage($route = '')
    {
        if ($route == '') {
            $page = Page::where('is_root', true)->where('is_published', 1);
        } else {
            $page = Page::where('route', $route)->where('is_published', 1);
        }

        $page = $page->first();

        if (!$page) {
            $segments = Str::of($route)->explode('/');

            $depth = 0;

            while (!$page) {
                $segments->pop();

                $page = Page::where('route', $segments->join('/'))->where('is_published', 1)
                    ->first();
                $depth++;

                if (!$page && $segments->isEmpty()) {
                    abort(404);
                }
            }

            // the last segment maybe resolves to a stored object
            $moduleBlocks = $this->moduleService->getBlocks();

            $hasModule = false;

            // check page blocks for registered modules
            foreach ($page->pageBlocks as $pageBlock) {
                foreach ($moduleBlocks as $moduleBlock) {
                    if ($pageBlock['type'] == $moduleBlock['type']) {
                        $hasModuleBlock = true;

                        break;
                    }
                }
            }

            if (!$hasModuleBlock) {
                abort(404);
            }

            return $this->renderPage($page, false, $depth);
        }

        return $this->renderPage($page);
    }

    public function getPageRevision($pageRevisionId)
    {
        $pageRevision = PageRevision::where('id', $pageRevisionId)->firstOrFail();

        return $this->renderPage($pageRevision, true);
    }

    private function prepareView(\Illuminate\View\View $view)
    {
        // attach menu
        $query = Page::query();
        $pages = $query
            ->where('is_published', 1)
            ->where('is_shown_in_menu', 1)
            ->where('parent_page_id', 0)
            ->with('descendants')
            ->get();

        return $view->with(compact('pages'));
    }

    private function initPage($page)
    {
        // config
        config(['page.currentPageId' => $page->id]);
        config(['page.currentPageRoute' => ModuleHelper::getPageRoute($page->id)]);
        config(['page.currentUrl' => request()->url()]);
        config(['page.parentPageRoute' => $page->parent_page_id > 0 ? ModuleHelper::getPageRoute($page->parent_page_id) : null]);

        // settings
        $settings = Settings::all();

        foreach ($settings as $item) {
            config(["settings.{$item->id}" => $item->value]);
        }

        // card templates
        $cardTemplates = CardTemplate::all();

        foreach ($cardTemplates as $cardTemplate) {
            config(["cardTemplates.{$cardTemplate->id}" => collect($cardTemplate)]);
        }

        return $page;
    }

    private function renderPage($page, $isRevision = false, $depth = 0)
    {
        $pageTemplate = $page->pageTemplate;

        if (!$pageTemplate) {
            abort(500, 'Page has no template');
        }

        $page = $this->initPage($page);

        $pageTemplateSlug = Str::slug($pageTemplate->name);
        $viewTemplate = "templates.{$pageTemplateSlug}";

        $view = view($viewTemplate);
        $view->getFactory()->startSection('title', $page->name);

        // page sections
        $pageSections = $page->pageSections();

        $moduleBlocks = $this->moduleService->getBlocks();

        $lastSegment = last(request()->segments());

        foreach ($pageSections as &$pageSection) {
            foreach ($pageSection['pageBlocks'] as &$pageBlock) {
                foreach ($moduleBlocks as $moduleBlock) {
                    if ($pageBlock['type'] == $moduleBlock['type'] && $moduleBlock['depth'] == $depth) {
                        $controller = $moduleBlock['method'][0];
                        $action = $moduleBlock['method'][1];

                        $response = app()->call("{$controller}@{$action}", [
                            'config' => json_decode($pageBlock['content']),
                            'segment' => $lastSegment
                        ]);

                        $pageBlock['view'] = $response;

                        if ($moduleBlock['override'] === true) {
                            foreach ($pageSection['pageBlocks'] as $i => $otherPageBlock) {
                                if ($pageBlock !== $otherPageBlock) {
                                    unset($pageSection['pageBlocks'][$i]);
                                }
                            }
                        }

                        break;
                    }
                }

                // TODO: abstract and refactor... maybe
                if ($pageBlock['type'] == 'carousel') {
                    $content = json_decode($pageBlock['content']);

                    if ($content && isset($content->type) && $content->type == 'module') {
                        $module = Str::ucfirst(explode('-', $content->module)[0]);
                        $className = "Yago\\{$module}\\Services\\DataProviderService";

                        if (class_exists($className)) {
                            $dataProviderService = new $className;
                            $pseudoPageBlock = [
                                'type' => $content->module,
                                'content' => '',
                            ];

                            if ($dataProviderService instanceof AbstractDataProviderService) {
                                $pageBlock['data'] = $dataProviderService->provide($pseudoPageBlock);
                            }
                        }
                    }
                } else {
                    $module = Str::ucfirst(explode('-', $pageBlock['type'])[0]);
                    $className = "Yago\\{$module}\\Services\\DataProviderService";

                    if (class_exists($className)) {
                        $dataProviderService = new $className;

                        if ($dataProviderService instanceof AbstractDataProviderService) {
                            $pageBlock['data'] = $dataProviderService->provide($pageBlock);
                        }
                    }
                }
            }
            unset($pageBlock);
        }
        unset($pageSection);

        // fields
        $fields = Field::all();

        $data = compact('pageSections', 'fields');

        return $this->prepareView($view->with(compact('page', 'data', 'isRevision')));
    }
}
