<?php

namespace Yago\Cms\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function getConfig(Request $request)
    {
        return json_decode($request->session()->pull('config', '{}'));
    }

    public function getSegment(Request $request)
    {
        return $request->session()->pull('segment');
    }
}
