<?php

namespace Yago\Cms\GraphQL\Mutations;

use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Yago\Cms\Models\Page;

class SortPages
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
                ->where('id', $input['id'])
                ->update([
                    'parent_page_id' => $input['parent_page_id'],
                    'sorting' => $input['sorting'],
                ]);

            $ids[] = $input['id'];
        }

        $pages = Page::whereIn('id', $ids)->get();

        foreach ($pages as $page) {
            $page = Page::updateRoute($page);
            $page->save();
        }

        return $pages;
    }
}
