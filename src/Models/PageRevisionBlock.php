<?php

namespace Yago\Cms\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageRevisionBlock extends Model
{
    use HasFactory;

    public function pageRevision(): BelongsTo
    {
        return $this->belongsTo(PageRevision::class);
    }

    public function pageTemplateSection(): BelongsTo
    {
        return $this->belongsTo(PageTemplateSection::class);
    }
}
