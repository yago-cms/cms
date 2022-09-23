<?php

namespace Yago\Cms\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ModuleService
{
    private $modules = [];

    public function register($module)
    {
        if (isset($this->modules[$module])) {
            throw new \Exception("Module \"$module\" is already registered.");
        }

        $this->modules[$module] = [
            'name' => $module,
            'blocks' => [],
        ];
    }

    public function registerBlock($module, $type, $method, $depth = 0, $override = false)
    {
        if (!isset($this->modules[$module])) {
            throw new \Exception("Module \"$module\" is not registered.");
        }

        $this->modules[$module]['blocks'][] = [
            'type' => $type,
            'method' => $method,
            'depth' => $depth,
            'override' => $override,
        ];
    }

    public function getModules()
    {
        return $this->modules;
    }

    public function getModuleBlocks($module)
    {
        if (!isset($this->modules[$module])) {
            throw new \Exception("Module \"$module\" is not registered.");
        }

        return $this->modules[$module]['blocks'];
    }

    public function getBlocks()
    {
        $blocks = [];

        foreach ($this->modules as $module) {
            $blocks = [
                ...$blocks,
                ...$module['blocks'],
            ];
        }

        return $blocks;
    }

    public function getScripts()
    {
        $scripts = [];

        if (app()->environment('local-dev')) {
            $scripts[] = public_path('/vendor/cms/js/vendor.js');
            $scripts[] = public_path('/vendor/cms/js/app.js');
        } else {
            $scripts[] = public_path('/vendor/cms/js/vendor.min.js');
            $scripts[] = public_path('/vendor/cms/js/app.min.js');
        }

        foreach ($this->modules as $module) {
            if (app()->environment('local-dev')) {
                $filename = 'main.js';
            } else {
                $filename = 'main.min.js';
            }

            $path = public_path("vendor/{$module['name']}/js/{$filename}");

            if (!File::exists($path)) {
                throw new \Exception("Script bundle for module \"{$module['name']}\" not found at \"{$path}\".");
            }

            $scripts[] = $path;
        }

        $bundle = '';

        foreach ($scripts as $script) {
            $bundle .= file_get_contents($script);
        }
        Storage::put('public/bundle.js', $bundle);

        return '<script src="/storage/bundle.js"></script>';
    }
}
