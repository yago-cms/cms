@props(['pages', 'depth' => -1])

<ul class="navbar-nav me-auto mb-2 mb-lg-0">
    @foreach ($pages as $page)
        <x-yago-cms::core.page-nav-item :page="$page" :level="0" :depth="$depth" />
    @endforeach
</ul>
