<?php

namespace Yago\Cms\Helpers;

class CardHelper
{
    public static function getType($type, $card)
    {
        foreach ($card['data'] as $item) {
            if ($item['type'] == $type) {
                return $item;
            }
        }

        return null;
    }

    public static function getById($id, $card)
    {
        foreach ($card['data'] as $item) {
            if ($item['id'] == $id) {
                return $item;
            }
        }

        return null;
    }

    public static function getContentById($id, $card)
    {
        $item = self::getById($id, $card);

        if (isset($item['content'])) {
            return $item['content'];
        }

        return null;
    }
}
