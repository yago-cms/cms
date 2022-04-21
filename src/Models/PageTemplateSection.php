<?php

namespace Yago\Cms\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PageTemplateSection extends Model
{
    use HasFactory;

    public function pageBlocks(): HasMany
    {
        return $this->hasMany(PageBlock::class);
    }

    public function pageTemplateSectionColumns(): HasMany
    {
        return $this->hasMany(PageTemplateSectionColumn::class);
    }
}
