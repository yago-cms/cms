<?php

namespace Yago\Cms\Models;

use Yago\Cms\Traits\PageTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PageRevision extends Model
{
    use HasFactory, PageTrait;

    public function pageRevisionBlocks(): HasMany
    {
        return $this->hasMany(PageRevisionBlock::class);
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }
}
