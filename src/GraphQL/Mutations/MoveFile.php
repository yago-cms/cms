<?php

namespace Yago\Cms\GraphQL\Mutations;

use Yago\Cms\Services\FileManagerService;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class MoveFile
{
    public function __construct(FileManagerService $fileManager)
    {
        $this->fileManager = $fileManager;
    }

    public function __invoke(
        $rootValue,
        array $args,
        GraphQLContext $context,
        ResolveInfo $resolveInfo
    ) {
        ['path' => $path, 'source' => $source, 'destination' => $destination] = $args;

        if ($path[0] !== '/') {
            $path = '/' . $path;
        }

        if ($source[0] !== '/') {
            $source = '/' . $source;
        }

        if (!$destination) {
            $destination = '/';
        }

        if ($destination[0] !== '/') {
            $destination = '/' . $destination;
        }

        $storagePath = 'public/upload';
        $basePath = storage_path('app/' . $storagePath);

        if (File::exists($basePath . $source) && File::isDirectory($basePath . $destination)) {
            Storage::move($storagePath . $source, $storagePath . $destination . '/' . basename($source));
        }

        return $this->fileManager->getFiles($path);
    }
}
