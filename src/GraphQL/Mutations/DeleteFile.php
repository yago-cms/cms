<?php

namespace Yago\Cms\GraphQL\Mutations;

use Yago\Cms\Services\FileManagerService;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class DeleteFile
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
        ['path' => $path] = $args;

        $storagePath = 'public/upload/';
        $basePath = storage_path('app/' . $storagePath);
        $filePath = $basePath . $path;
        $sourceBasePath = str_replace(File::basename($path), '', $path);

        if (File::isFile($filePath)) {
            File::delete($filePath);
        } else if (File::isDirectory($filePath)) {
            File::deleteDirectory($filePath);
        }

        return $this->fileManager->getFiles($sourceBasePath);
    }
}
