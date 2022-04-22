@inject('moduleService', 'Yago\\Cms\\Services\\ModuleService')

<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet">

    <title>@yield('title')</title>
</head>

<body class="body">
    <div id="app"></div>

    @env(['production', 'local'])
    <script src="/vendor/cms/js/vendor.min.js"></script>
    <script src="/vendor/cms/js/app.min.js"></script>
    @endenv

    @env('local-dev')
    <script src="/vendor/cms/js/vendor.js"></script>
    <script src="/vendor/cms/js/app.js"></script>
    @endenv

    {!! $moduleService->getScripts() !!}

    @stack('scripts')
</body>

</html>
