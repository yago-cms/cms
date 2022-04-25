@php
$url = '';

if ($content->source == 'page') {
    $url = ModuleHelper::getPageRoute($content->page);
} elseif ($content->source == 'external') {
    $url = $content->url;
}
@endphp

@if ($content->type == 'link')
    <a href="{{ $url }}">{{ $content->label }}</a>
@elseif ($content->type == 'button')
    <a href="{{ $url }}" class="btn btn-primary">{{ $content->label }}</a>
@endif
