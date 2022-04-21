<?php

namespace Yago\Cms\Services;

use Illuminate\Support\Str;

abstract class AbstractDataProviderService
{
    public function provide(array $pageBlock)
    {
        $blockType = collect(explode('-', $pageBlock['type']));
        $blockType->shift();
        $blockType = Str::camel($blockType->join('-'));

        if (method_exists(get_called_class(), $blockType)) {
            return $this->{$blockType}($pageBlock);
        }

        return collect();
    }
}
