<?php

namespace Yago\Cms\GraphQL\Mutations;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\AuthManager;

class Login
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
        $input = $args['input'];

        $userProvider = $this->authManager->createUserProvider('users');

        $user = $userProvider->retrieveByCredentials([
            'email' => $input['email'],
            'password' => $input['password'],
        ]);

        if (!$user || !$userProvider->validateCredentials($user, $input)) {
            throw new AuthenticationException('The provided credentials are incorrect.');
        }

        return [
            'token' => $user->createToken('default')->plainTextToken,
        ];
    }
}
