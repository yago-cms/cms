@props([
    'id',
    'isPagination' => false,
    'isNavigation' => false,
    'isScrollbar' => false,
    'isLoop' => false,
    'isAutoplay' => false,
    'isDisableOnInteraction' => false,
    'isPauseOnMouseEnter' => false,
    'isStopOnLastSlide' => false,
    'direction' => 'horizontal',
    'delay',
    'tabs',
    'tab',
    'type' => 'fixed',
    'breakpoint' => 'default',
    'breakpoints',
    'cards',
    'cardComponent',
    'slides',
    'captions',
    'module',
    'moduleData',
    'type',
    'slides',
    ])

@php
$isTabs = $tabs ?? false;
$isCaptions = $captions ?? false;
$isBreakpoints = $breakpoints ?? false;
@endphp

<div id="{{ $id }}">
    @if ($isTabs === true)
        <div class="swiper-tab-list">
            @foreach ($tabs as $i => $tab)
                <div class="swiper-tab-list__item" id="swiper-tab-{{ $i }}">
                    @if ($tabType == 'text')
                        {{ $tab->content }}
                    @elseif ($tabType == 'media')
                        <x-yago-cms::core.picture :media="$tab->content" :breakpointGroup="$breakpoint" />
                    @endif
                </div>
            @endforeach
        </div>
    @endif

    <div class="swiper">
        <div class="swiper-wrapper">
            @if ($type == 'card')
                @foreach ($cards as $i => $card)
                    <div class="swiper-slide"
                        @if ($isTabs) data-swiper-tab="#swiper-tab-{{ $i }}" @endif>
                        <x-dynamic-component :component="$cardComponent" :card="$card" />
                    </div>
                @endforeach
            @elseif ($type == 'fixed')
                @foreach ($slides as $slide)
                    <div class="swiper-slide"
                        @if ($isTabs) data-swiper-tab="#swiper-tab-{{ $i }}" @endif>
                        <x-yago-cms::core.picture :media="$slide->media" :breakpointGroup="$breakpoint" />

                        @if ($isCaptions)
                            <div class="swiper-slide__inner-wrap">
                                <div class="swiper-slide__inner">
                                    <div class="swiper-slide__caption">{{ $slide->caption }}</div>
                                    <div class="swiper-slide__sub-caption">{{ $slide->subCaption }}</div>
                                </div>
                            </div>
                        @endif
                    </div>
                @endforeach
            @elseif ($type == 'module' && !empty($module))
                <x-dynamic-component component="yago-{{ $module }}" :data="$moduleData" />
            @endif
        </div>

        @if ($isPagination)
            <div class="swiper-pagination"></div>
        @endif

        @if ($isNavigation)
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
        @endif

        @if ($isScrollbar)
            <div class="swiper-scrollbar"></div>
        @endif
    </div>
</div>

@once
    <link rel="stylesheet" href="https://unpkg.com/swiper@8/swiper-bundle.min.css" />
    <style>
        .swiper-tab-list {
            position: relative;
        }

        .swiper-tab-list__item {
            opacity: 0;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            transition: opacity 0.3s ease-in-out;
        }

        .swiper-tab-list__item.active {
            opacity: 1;
        }

    </style>
@endonce

<script type="module">
    import Swiper from 'https://unpkg.com/swiper@8/swiper-bundle.esm.browser.min.js'

    const swiper = new Swiper('#{{ $id }} .swiper', {
        direction: '{{ $direction }}',
        loop: {{ $isLoop ? 'true' : 'false' }},
        @if ($isAutoplay)
            autoplay: {
            delay: {{ $delay }},
            disableOnInteraction: {{ $isDisableOnInteraction ? 'true' : 'false' }},
            pauseOnMouseEnter: {{ $isPauseOnMouseEnter ? 'true' : 'false' }},
            stopOnLastSlide: {{ $isStopOnLastSlide ? 'true' : 'false' }},
            },
        @else
            autoplay: false,
        @endif
        @if ($isPagination)
            pagination: {
            el: '.swiper-pagination',
            },
        @endif
        @if ($isNavigation)
            navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            },
        @endif
        tabs: {{ $isTabs ? 'true' : 'false' }},
        @if ($isBreakpoints)
            breakpoints: {
            @foreach ($breakpoints as $breakpoint)
                @php
                    $isSlidesPerView = $breakpoint->slidesPerView > 0;
                    $isSlidesPerGroup = $breakpoint->slidesPerGroup > 0;
                    $isSpaceBetween = $breakpoint->spaceBetween > 0;
                @endphp

                {{ $breakpoint->targetWidth }}: {
                @if ($isSlidesPerView)
                    slidesPerView: {{ $breakpoint->slidesPerView }},
                @endif
                @if ($isSlidesPerGroup)
                    slidesPerGroup: {{ $breakpoint->slidesPerGroup }},
                @endif
                @if ($isSpaceBetween)
                    spaceBetween: {{ $breakpoint->spaceBetween }},
                @endif
                },
            @endforeach
            },
        @endif
        on: {
            activeIndexChange(e) {
                if (e.params.tabs === true) {
                    const currentTab = document.querySelector(e.slides[e.activeIndex].dataset.swiperTab);
                    const previousTab = document.querySelector(e.slides[e.previousIndex].dataset.swiperTab);

                    previousTab.classList.remove('active');
                    currentTab.classList.add('active');
                }
            }
        }
    });
</script>
