<?php

namespace Yago\Cms\Http\Controllers;

use Illuminate\Contracts\Filesystem\Filesystem;
use League\Glide\Responses\LaravelResponseFactory;
use League\Glide\ServerFactory;

class ImageController extends Controller
{
    public function show(Filesystem $filesystem, $path)
    {
        $server = ServerFactory::create([
            'response' => new LaravelResponseFactory(app('request')),
            'source' => $filesystem->getDriver(),
            'source_path_prefix' => 'public/upload',
            'cache' => $filesystem->getDriver(),
            'cache_path_prefix' => '.cache',
            'cache_with_file_extensions' => true,
            'base_url' => 'img',
        ]);

        return $server->getImageResponse($path, request()->all());
    }
}