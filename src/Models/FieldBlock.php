<?php

namespace Yago\Cms\Models;

use Yago\Cms\Contracts\Block;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FieldBlock extends Model implements Block
{
    use HasFactory;

    public function field(): BelongsTo
    {
        return $this->belongsTo(Field::class);
    }

}
