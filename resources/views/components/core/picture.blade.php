@props(['media', 'breakpointGroup', 'class' => '', 'imgClass' => 'img-fluid d-block'])

@php
$cdn = MediaHelper::getCdn();
$breakpoints = MediaHelper::getBreakpoints($breakpointGroup);
@endphp

<picture class="{{ $class }}">
    @foreach ($breakpoints as $i => $breakpoint)
        @php
            switch ($cdn->type) {
                case 'imgix':
                    $pathinfo = pathinfo($media);

                    $source =
                        rtrim($cdn->source, '/') .
                        '/' .
                        $pathinfo['dirname'] .
                        '/' .
                        rawurlencode($pathinfo['basename']) .
                        '?' .
                        http_build_query([
                            'w' => $breakpoint->targetWidth,
                            'h' => $breakpoint->targetHeight,
                            'fit' => $breakpoint->fit,
                        ]);

                    break;

                default:
                    $source = asset("storage/upload/{$media}");
                    break;
            }
        @endphp

        @if ($i == 0)
            <img class="{{ $imgClass }}" src="{{ $source }}">
        @else
            <source srcset="{{ $source }}" media="(min-width: {{ $breakpoint->minWidth }}px)">
        @endif
    @endforeach
</picture>
