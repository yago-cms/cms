@props([
    'id',
    'i',
    'label',
    'isFirstOpen' => false,
    'isAlwaysOpen' => false,
    'isUseLabelAsId' => false,
])

@php
$headingId = 'bs-heading-' . Str::uuid();

if ($isUseLabelAsId) {
    $collapseId = Str::slug($label);
} else {
    $collapseId = 'bs-collapse-' . Str::uuid();
}
@endphp

<div class="accordion-item">
    <div class="accordion-header" id="{{ $headingId }}">
        <button class="accordion-button{{ $i == 0 && $isFirstOpen ? '' : ' collapsed' }}"
            type="button" data-bs-toggle="collapse" data-bs-target="#{{ $collapseId }}"
            aria-controls="{{ $collapseId }}"
            @if ($i == 0 && $isFirstOpen) aria-expanded="true" @endif>
            {{ $label }}
        </button>
    </div>

    <div id="{{ $collapseId }}"
        class="accordion-collapse collapse{{ $i == 0 && $isFirstOpen ? ' show' : '' }}"
        aria-labelledby="{{ $headingId }}"
        @if (!$isAlwaysOpen) data-bs-parent="#{{ $id }}" @endif>
        <div class="accordion-body">
            {{ $slot }}
        </div>
    </div>
</div>