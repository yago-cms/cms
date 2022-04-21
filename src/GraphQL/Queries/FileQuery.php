<?php

namespace Yago\Cms\GraphQL\Queries;

use Yago\Cms\Services\FileManagerService;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class FileQuery
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

        if (!$path) {
            $path = '/';
        }

        if ($path[0] !== '/') {
            $path = '/' . $path;
        }

        return $this->fileManager->getFiles($path);
    }
}
