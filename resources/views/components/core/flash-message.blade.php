@props([
    'context' => 'main',
])

@if (Session::has('message') && Session::get('message-context') == $context)
    <div class="alert alert-{{ Session::get('message-type', 'info') }}">
        {{ Session::get('message') }}
    </div>
@endif
