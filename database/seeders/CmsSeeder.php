<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CmsSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            PermissionsSeeder::class,
            SettingsSeeder::class,
        ]);
    }
}
