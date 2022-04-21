<?php

namespace Yago\Cms\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PageTemplate extends Model
{
    use HasFactory;

    public function pageTemplateSections(): HasMany
    {
        return $this->hasMany(PageTemplateSection::class);
    }
}
