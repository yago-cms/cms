<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Add default media breakpoints
        DB::table('settings')->insert([
            'id' => 'media',
            'value' => json_encode([
                'cdn' => [
                    'type' => 'default',
                ],
                'breakpointGroups' => [
                    [
                        'breakpoints' => [
                            [
                                'minWidth' => 0,
                                'targetWidth' => 576,
                                'targetHeight' => 800,
                                'fit' => 'crop',
                            ],
                            [
                                'minWidth' => 576,
                                'targetWidth' => 768,
                                'targetHeight' => 800,
                                'fit' => 'crop',
                            ],
                            [
                                'minWidth' => 768,
                                'targetWidth' => 1200,
                                'targetHeight' => 800,
                                'fit' => 'crop',
                            ],
                            [
                                'minWidth' => 1200,
                                'targetWidth' => 1920,
                                'targetHeight' => 1080,
                                'fit' => 'crop',
                            ],
                            [
                                'minWidth' => 1920,
                                'targetWidth' => 3000,
                                'targetHeight' => 1688,
                                'fit' => 'crop',
                            ],
                        ],
                        'name' => 'Default',
                        'key' => 'default'
                    ]
                ],
            ]),
        ]);
    }
}
