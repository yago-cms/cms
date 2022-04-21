<?php

namespace Yago\Cms\Services;

class MenuService
{
    private $menus = [];

    public function register($name, $callback)
    {
        if (isset($this->menus[$name])) {
            throw new \Exception("Menu $name already exists.");
        }

        $this->menus[$name] = $callback;
    }

    public function getMenus()
    {
        return $this->menus;
    }

    public function getMenu($name, $params)
    {
        if (!isset($this->menus[$name])) {
            throw new \Exception("Menu $name deos not exist.");
        }

        return $this->menus[$name](...$params);
    }
}
