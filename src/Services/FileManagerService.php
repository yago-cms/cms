<?php

namespace Yago\Cms\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class FileManagerService
{
    const TYPE_DIRECTORY = 0;
    const TYPE_FILE = 1;
    const TYPE_IMAGE = 2;

    private $imageTypes = ['jpg', 'jpeg', 'png'];

    public function getFiles($path)
    {
        if (!Storage::exists('public/upload/')) {
            Storage::makeDirectory('public/upload/');
        }

        if ($path === '' || $path[0] != '/') {
            $path = '/' .  $path;
        }

        if ($path != '/' && $path[strlen($path) - 1] == '/') {
            $path = substr($path, 0, -1);
        }

        $storagePath = 'public/upload';
        $basePath = storage_path('app/' . $storagePath);
        $realPath = realpath($basePath . $path);

        if ($realPath && substr($realPath, 0, strlen($basePath)) == $basePath) {
            $relativePath = str_replace($basePath, $storagePath, $realPath);

            $files = [];

            foreach (Storage::directories($relativePath) as $directory) {
                $files[] = [
                    'path' => str_replace($storagePath . '/', '', $directory),
                    'name' => basename($directory),
                    'type' => self::TYPE_DIRECTORY,
                ];
            }

            foreach (Storage::files($relativePath) as $file) {
                $files[] = [
                    'path' => str_replace($storagePath . '/', '', $file),
                    'name' => basename($file),
                    'type' => $this->fileType($file),
                    'extension' => File::extension($file),
                ];
            }

            return [
                'path' => $path,
                'files' => $files,
            ];
        }

        return [];
    }

    private function fileType($file)
    {
        return $this->isImage($file) ? self::TYPE_IMAGE : self::TYPE_FILE;
    }

    private function isImage($file)
    {
        return in_array(File::extension($file), $this->imageTypes);
    }
}
