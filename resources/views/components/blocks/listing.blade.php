@if ($content->items)
    {!! '<' . $content->type . '>' !!}

    @foreach ($content->items as $item)
        <li>
            {{ $item->item }}
        </li>
    @endforeach

    {!! '</' . $content->type . '>' !!}
@endif
