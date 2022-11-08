<?php

namespace Yago\Cms\Helpers;

use Yago\Cms\Models\Page;

class ModuleHelper
{
    public static function getPageRoute($pageId)
    {
        $page = Page::find($pageId);

        return strlen($page->route) > 0 && $page->route[0] != '/' ?
            '/'.$page->route :
            $page->route;
    }
}
