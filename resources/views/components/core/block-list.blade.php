@foreach ($blocks as $block)
    <x-yago-cms::core.block :block="$block" />
@endforeach
