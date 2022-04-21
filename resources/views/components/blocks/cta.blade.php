@php
$url = '';

if ($content->source == 'page') {
    $url = ModuleHelper::getPageRoute($content->page);
} elseif ($content->source == 'external') {
    $url = $content->url;
}
@endphp

<a href="{{ $url }}" class="btn btn-primary">{{ $content->label }}</a>
