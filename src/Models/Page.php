<?php

namespace Yago\Cms\Models;

use Yago\Cms\Traits\PageTrait;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Page extends Model
{
    use HasFactory, PageTrait;

    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('order', function (Builder $builder) {
            $builder->orderBy('sorting', 'asc');
        });
    }

    protected static function booted()
    {
        static::saving(function ($page) {
            $page = Page::updateRoute($page);

            if ($page->is_root) {
                \DB::table('pages')
                    ->where('id', '!=', $page->id)
                    ->update([
                        'is_root' => 0,
                    ]);
            }
        });
    }

    public function directAscendant(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'parent_page_id');
    }

    public function ascendant(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'parent_page_id')->with('ascendant');
    }

    public function directDescendants(): HasMany
    {
        return $this->hasMany(Page::class, 'parent_page_id');
    }

    public function descendants(): HasMany
    {
        return $this->hasMany(Page::class, 'parent_page_id')->with('descendants');
    }

    public static function updateRoute($page)
    {
        $ascendant = $page->ascendant;
        $route = [];

        while ($ascendant) {
            $route[] = $ascendant->slug;

            $ascendant = $ascendant->ascendant;
        }

        $route = array_reverse($route);

        $slug = Str::slug($page->name);
        $route[] = $slug;

        $page->slug = $slug;
        $page->route = implode('/', $route);

        return $page;
    }
}
