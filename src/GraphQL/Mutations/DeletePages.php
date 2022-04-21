<?php

namespace Yago\Cms\GraphQL\Mutations;

use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class DeletePages
{
    public function __invoke(
        $rootValue,
        array $args,
        GraphQLContext $context,
        ResolveInfo $resolveInfo
    ) {
        $ids = [];

        foreach ($args['input'] as $input) {
            \DB::table('pages')
                ->where('id', $input)
                ->delete();

            $ids[] = $input;
        }

        return $ids;
    }
}
