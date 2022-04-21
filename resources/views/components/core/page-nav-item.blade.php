<li class="nav-item">
    <a class="nav-link" href="/{{ $page->route }}">{{ $page->name }}</a>

    @if (count($page->descendants) > 0 && ($level < $depth || $depth == -1))
        <ul>
            @foreach ($page->descendants as $page)
                @if ($page->is_shown_in_menu)
                    <x-yago-cms::core.page-nav-item :page="$page" :level="++$level" :depth="$depth" />
                @endif
            @endforeach
        </ul>
    @endif
</li>
