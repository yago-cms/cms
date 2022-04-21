<?php

namespace Yago\Cms\Traits;

use Yago\Cms\Models\Page;
use Yago\Cms\Models\PageBlock;
use Yago\Cms\Models\PageRevision;
use Yago\Cms\Models\PageRevisionBlock;
use Yago\Cms\Models\PageTemplate;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait PageTrait
{
    public function pageTemplate(): BelongsTo
    {
        return $this->belongsTo(PageTemplate::class);
    }

    public function pageBlocks(): HasMany
    {
        if ($this instanceof Page) {
            return $this->hasMany(PageBlock::class);
        } else if ($this instanceof PageRevision) {
            return $this->hasMany(PageRevisionBlock::class);
        }
    }

    public function pageSection($name)
    {
        $pageSections = $this->pageSections();

        foreach ($pageSections as $pageSection) {
            if ($pageSection['name'] == $name) {
                return $pageSection;
            }
        }

        return null;
    }

    public function pageSectionBlocks($name)
    {
        $pageSection = $this->pageSection($name);

        if (!$pageSection) {
            return [];
        }

        return $pageSection['pageBlocks'];
    }

    public function pageSections()
    {
        static $pageSections;

        if ($pageSections) {
            return $pageSections;
        }

        $pageSections = [];
        $pageTemplateSections = $this->pageTemplate->pageTemplateSections;

        foreach ($pageTemplateSections as $pageTemplateSection) {
            $pageSection = [
                'id' => $pageTemplateSection->id,
                'name' => $pageTemplateSection->name,
                'pageBlocks' => [],
            ];

            $columns = [];

            foreach ($this->pageBlocks as $pageBlock) {
                if ($pageBlock->page_template_section_id == $pageTemplateSection->id) {
                    $pageSection['pageBlocks'][] = [
                        'column' => $pageBlock->page_template_section_column_id,
                        'type' => $pageBlock->type,
                        'content' => $pageBlock->content,
                        'sorting' => $pageBlock->sorting,
                    ];

                    $columns[] = $pageBlock->page_template_section_column_id;
                }
            }

            // normalize column index
            $columns = collect($columns)->unique()->sort()->values();

            foreach ($pageSection['pageBlocks'] as &$pageBlock) {
                $pageBlock['column'] = $columns->search($pageBlock['column']);
            }
            unset($pageBlock);

            $pageSection['pageBlocks'] = collect($pageSection['pageBlocks'])->sortBy('sorting')->toArray();

            $pageSections[] = $pageSection;
        }

        return $pageSections;
    }
}
