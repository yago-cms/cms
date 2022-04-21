@foreach ($medias as $media)
    <x-yago-cms::core.picture :media="$media->source" :breakpointGroup="$content->breakpoint" />
@endforeach
