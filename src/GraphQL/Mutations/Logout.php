<?php

namespace Yago\Cms\GraphQL\Mutations;

use Illuminate\Auth\AuthManager;

class Logout
{
    protected AuthManager $authManager;

    public function __construct(AuthManager $authManager)
    {
        $this->authManager = $authManager;
    }

    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $user = $this->authManager->guard('sanctum')->user();

        $personalAccessToken = $user->currentAccessToken();
        $personalAccessToken->delete();

        return [
            'message' => 'Your session has been terminated',
        ];
    }
}
