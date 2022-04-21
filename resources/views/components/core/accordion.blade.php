@props(['id'])

<div class="accordion" id="{{ $id }}">
    {{ $slot }}
</div>
