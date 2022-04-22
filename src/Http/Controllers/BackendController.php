<?php

namespace Yago\Cms\Http\Controllers;

class BackendController extends Controller
{
    public function index()
    {
        return view('yago-cms::layouts.backend');
    }
}
