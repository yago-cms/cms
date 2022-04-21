@php
$id = 'bs-accordion-' . Str::uuid();
$isAlwaysOpen = $content->alwaysOpen;
$isFirstOpen = $content->firstOpen;
$isUseLabelAsId = $content->useLabelAsId;
@endphp

@if ($content->type == 'card')
    <x-yago-cms::core.accordion
        :id="$id"
    >
        @foreach ($cards as $i => $card)
            <x-yago-cms::core.accordion.item
                :id="$id"
                :i="$i"
                :label="$card['label']"
                :is-always-open="$isAlwaysOpen"
                :is-first-open="$isFirstOpen"
                :is-use-label-as-id="$isUseLabelAsId"
            >
                <x-dynamic-component :component="$cardComponent" :card="$card" />
            </x-yago-cms::core.accordion.item>
        @endforeach
    </x-yago-cms::core.accordion>
@elseif ($content->type == 'text')
    <x-yago-cms::core.accordion
        :id="$id"
    >
        @foreach ($content->texts as $i => $text)
            <x-yago-cms::core.accordion.item
                :id="$id"
                :i="$i"
                :label="$text->label"
                :is-always-open="$isAlwaysOpen"
                :is-first-open="$isFirstOpen"
                :is-use-label-as-id="$isUseLabelAsId"
            >
                @if (isset($text->text))
                    {!! $text->text !!}
                @endif
            </x-yago-cms::core.accordion.item>
        @endforeach
    </x-yago-cms::core.accordion>
@endif
