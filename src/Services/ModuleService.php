<?php

namespace Yago\Cms\Services;

use Illuminate\Support\Facades\File;

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

            $scripts[] = '<script src="' . str_replace(public_path(), '', $path) . '"></script>';
        }

        return implode("\n", $scripts);
    }
}
