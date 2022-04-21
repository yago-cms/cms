<?php

namespace Yago\Cms\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Field extends Model
{
    public function fieldBlocks(): HasMany
    {
        return $this->hasMany(FieldBlock::class);
    }
}
