<?php

namespace Yago\Cms\Models;

use Yago\Cms\Contracts\Block;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageBlock extends Model implements Block
{
    use HasFactory;

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }

    public function pageTemplateSection(): BelongsTo
    {
        return $this->belongsTo(PageTemplateSection::class);
    }
}
