@if (isset($block['view']))
    {!! $block['view'] !!}
@else
    <x-dynamic-component :component="$component" :block="$block" />
@endif
