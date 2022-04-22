<?php

namespace Yago\Cms\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;
use Yago\Cms\Console\Commands\Install;
use Yago\Cms\Helpers\CardHelper;
use Yago\Cms\Helpers\MediaHelper;
use Yago\Cms\Helpers\ModuleHelper;
use Yago\Cms\Helpers\SettingsHelper;
use Yago\Cms\Services\BlockService;
use Yago\Cms\Services\MenuService;
use Yago\Cms\Services\ModuleService;

class CmsServiceProvider extends ServiceProvider
{
    public function register()
    {
        // GraphQL
        $dispatcher = app(\Illuminate\Contracts\Events\Dispatcher::class);
        $dispatcher->listen(
            \Nuwave\Lighthouse\Events\BuildSchemaString::class,
            function (): string {
                return file_get_contents(__DIR__ . '/../../graphql/schema.graphql');
            }
        );

        Config::set('lighthouse.namespaces.models', [
            'Yago\\Cms\\Models',
            ...Config::get('lighthouse.namespaces.models'),
        ]);

        $queries = Config::get('lighthouse.namespaces.queries');

        if (!is_array($queries)) {
            $queries = [$queries];
        }

        Config::set('lighthouse.namespaces.queries', [
            'Yago\\Cms\\GraphQL\\Queries',
            ...$queries,
        ]);

        Config::set('lighthouse.namespaces.mutations', [
            'Yago\\Cms\\GraphQL\\Mutations',
            ...Config::get('lighthouse.namespaces.mutations'),
        ]);

        // Services
        $this->app->singleton(ModuleService::class, function () {
            return new ModuleService;
        });

        $this->app->singleton(MenuService::class, function () {
            return new MenuService;
        });

        // Helpers
        $loader = \Illuminate\Foundation\AliasLoader::getInstance();

        $loader->alias('SettingsHelper', SettingsHelper::class);
        $loader->alias('MediaHelper', MediaHelper::class);
        $loader->alias('CardHelper', CardHelper::class);
        $loader->alias('ModuleHelper', ModuleHelper::class);
    }

    public function boot()
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                Install::class,
            ]);
        }

        $this->loadRoutesFrom(__DIR__ . '/../../routes/web.php');
        $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');
        $this->loadViewsFrom(__DIR__ . '/../../resources/views', 'yago-cms');

        $this->publishes([
            __DIR__ . '/../../resources/dist' => public_path('vendor/cms'),
            __DIR__ . '/../../resources/img' => public_path('vendor/cms/img'),
        ], 'yago');

        Blade::componentNamespace('Yago\\Cms\\View\\Components', 'yago-cms');
    }
}
