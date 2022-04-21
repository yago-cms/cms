<div class="yc-card yc-card--{{ $card['key'] }}">
    @foreach ($card['data'] as $item)
        <div class="yc-card__section yc-card__section--{{ Str::slug($item['type']) }}">
            @switch($item['type'])
                @case('text')
                    {!! $item['content'] !!}
                @break

                @case('media')
                    <x-yago-cms::core.picture :media="$item['content']->source" :breakpointGroup="$item['content']->breakpointGroup" />
                @break

                @case('cta')
                    <a class="btn btn-primary" href="{{ $item['content'] }}">{{ $item['fields'][0]['text'] }}</a>
                @break
            @endswitch
        </div>
    @endforeach
</div>
