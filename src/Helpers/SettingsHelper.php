<?php

namespace Yago\Cms\Helpers;

use Illuminate\Support\Str;
use Illuminate\Support\Arr;

class SettingsHelper
{
    public static function get($key)
    {
        $keys = Str::of($key)->explode('.');
        $rootKey = $keys->first();

        $json = json_decode(config("settings.{$rootKey}"), true);
        $keys->shift();

        if ($keys->count() == 0) {
            return $json;
        }

        $key = $keys->join('.');

        return Arr::get($json, $key);
    }
}
