<?php

namespace Yago\Cms\GraphQL\Mutations;

use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class UpdateToLatestVersion
{
    public function __invoke(
        $rootValue,
        array $args,
        GraphQLContext $context,
        ResolveInfo $resolveInfo
    ) {
        $process = new Process(['php', 'artisan', 'yago:update', '--no-interaction']);
        $process->setWorkingDirectory(base_path());
        $process->setTimeout(3600);

        try {
            $process->mustRun();

            return ['message' => trim($process->getOutput())];
        } catch (ProcessFailedException $exception) {
            throw new \Exception($exception->getMessage());
        }
    }
}
