<?php

namespace Yago\Cms\GraphQL\Mutations;

use Yago\Cms\Services\FileManagerService;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class CreateFolder
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

        if ($path[0] !== '/') {
            $path = '/' . $path;
        }

        $path = $path . '/';

        $storagePath = 'public/upload';
        $basePath = storage_path('app/' . $storagePath);
        $filePath = $basePath . $path . $name;

        if (File::exists($filePath)) {
            throw new \Exception("File or folder already exists.");
        }

        File::makeDirectory($filePath);

        return $this->fileManager->getFiles($path);
    }
}
