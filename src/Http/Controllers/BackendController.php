<?php

namespace Yago\Cms\Http\Controllers;

use App\Http\Controllers\Controller;

class BackendController extends Controller
{
    public function index()
    {
        return view('yago-cms::layouts.backend');
    }
}
