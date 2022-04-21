@php
$id = 'swiper-' . Str::uuid();

$options = $content->options;
$isPagination = $options->pagination ?? false;
$isNavigation = $options->navigation ?? false;
$isScrollbar = $options->scrollbar ?? false;
$isLoop = $options->loop ?? false;
$direction = $options->direction ?? 'horizontal';
$isAutoplay = $options->autoplay->autoplay ?? false;
$isDisableOnInteraction = $isAutoplay && $options->autoplay->disableOnInteraction ?? false;
$isPauseOnMouseEnter = $isAutoplay && $options->autoplay->pauseOnMouseEnter ?? false;
$isStopOnLastSlide = $isAutoplay && $options->autoplay->stopOnLastSlide ?? false;
$delay = $isAutoplay ? $options->autoplay->delay ?? 0 : false;
@endphp

<x-yago-cms::core.carousel
    :id="$id"
    :type="$content->type"

    :is-pagination="$isPagination"
    :is-navigation="$isNavigation"
    :is-scrollbar="$isScrollbar"
    :is-loop="$isLoop"
    :is-autoplay="$isAutoplay"
    :is-disable-on-interaction="$isDisableOnInteraction"
    :is-pause-on-mouse-enter="$isPauseOnMouseEnter"
    :is-stop-on-last-slide="$isStopOnLastSlide"

    :direction="$direction"
    :delay="$delay"

    :tabs="$content->tabs ?? null"
    :tab-type="$options->tabType ?? null"

    :breakpoint="$content->breakpoint ?? null"
    :breakpoints="$content->breakpoints ?? null"

    :cards="$content->cards ?? null"
    :card-component="$component ?? null"

    :slides="$content->slides ?? null"
    :captions="$content->captions ?? null"

    :module="$content->module ?? null"
    :module-data="$data ?? null"
    />