<?php

namespace Yago\Cms\GraphQL\Mutations;

use Yago\Cms\Services\FileManagerService;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\File;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class RenameFile
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
        ['path' => $path, 'name' => $name] = $args;

        $storagePath = 'public/upload/';
        $basePath = storage_path('app/' . $storagePath);

        $sourceBasePath = str_replace(File::basename($path), '', $path);

        $destinationPath = $basePath . $sourceBasePath . $name;
        $sourcePath = $basePath . $path;

        if (File::exists($destinationPath)) {
            throw new \Exception('File already exists.');
        }

        File::move($sourcePath, $destinationPath);

        return $this->fileManager->getFiles($sourceBasePath);
    }
}
