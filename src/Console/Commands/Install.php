<?php

namespace Yago\Cms\Console\Commands;

use Illuminate\Console\Command;
use Yago\Cms\Services\ModuleService;

class Install extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'yago:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install YAGO cms';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(ModuleService $moduleService)
    {
        $this->info('Publishing assets');

        $this->call('vendor:publish', ['--tag' => 'yago']);

        foreach ($moduleService->getModules() as $module) {
            $this->call('vendor:publish', ['--tag' => "yago-{$module['name']}"]);
        }

        return 0;
    }
}
