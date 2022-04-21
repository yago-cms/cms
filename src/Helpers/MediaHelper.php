<?php

namespace Yago\Cms\Helpers;

class MediaHelper
{
    public static function getBreakpointGroup($key)
    {
        $mediaSettings = json_decode(config('settings.media'));

        foreach ($mediaSettings->breakpointGroups as $breakpointGroup) {
            if ($breakpointGroup->key == $key) {
                return $breakpointGroup;
            }
        }

        throw new \Exception("Invalid media breakpoint key '{$key}'");
    }

    public static function getBreakpoints($key)
    {
        $breakpointGroup = self::getBreakpointGroup($key);

        $breakpoints = collect($breakpointGroup->breakpoints)
            ->reverse();

        return $breakpoints;
    }

    public static function getCdn() {
        $mediaSettings = json_decode(config('settings.media'));

        return $mediaSettings->cdn;
    }
}
