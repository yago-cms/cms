<?php

namespace Yago\Cms\GraphQL\Mutations;

class UploadFiles
{
    /**
     * Upload a file, store it on the server and return the path.
     *
     * @param  mixed  $root
     * @param  array<string, mixed>  $args
     * @return string|null
     */
    public function __invoke($root, array $args): ?array
    {
        $path = ltrim($args['path'], '/');
        $files = $args['files'];
        $paths = [];

        foreach ($files as $file) {
            $paths[] = $file->storePubliclyAs("public/upload/$path", $file->getClientOriginalName());
        }

        return $paths;
    }
}
