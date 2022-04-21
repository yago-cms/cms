<?php

namespace Yago\Cms\GraphQL\Queries;

use GuzzleHttp\Client;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\File;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class VersionQuery
{
    public function __invoke(
        $rootValue,
        array $args,
        GraphQLContext $context,
        ResolveInfo $resolveInfo
    ) {
        $type = $args['directive'][0];

        if ($type == 'current') {
            $composerJson = File::get(base_path() . '/composer.json');

            if (!$composerJson) {
                throw new \Error('composer.json not found');
            }

            $composerJson = json_decode($composerJson);

            if (!isset($composerJson->version)) {
                throw new \Error('Version not set');
            }

            return ['version' => $composerJson->version];
        } else if ($type == 'latest') {
            $client = new Client([
                'base_uri' => 'https://api.github.com',
            ]);

            // Get tags
            $response = $client->request('GET', '/repos/yago-cms/yago-content/tags', [
                'headers' => [
                    'Accept' => 'application/vnd.github.v3+json',
                ]
            ]);

            $tags = json_decode($response->getBody());
            $releases = [];

            foreach ($tags as $tag) {
                if ($tag->name[0] === 'v') {
                    $releases[$tag->name] = $tag;
                }
            }

            $release = collect($releases)->first();

            return ['version' => $release->name];
        }
    }
}
