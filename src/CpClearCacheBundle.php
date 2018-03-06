<?php
/**
 * CP Cache QuickMenu plugin for Craft CMS 3.x
 *
 * Fewer clicks to get clearin'
 *
 * @link      https://vaersaagod.no
 * @copyright Copyright (c) 2018 Mats Mikkel Rummelhoff
 */

namespace mmikkel\cpclearcache;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;

class CpClearCacheBundle extends AssetBundle
{
    public function init()
    {
        // define the path that your publishable resources live
        $this->sourcePath = '@mmikkel/cpclearcache/resources';

        // define the dependencies
        $this->depends = [
            CpAsset::class,
        ];

        // define the relative path to CSS/JS files that should be registered with the page
        // when this asset bundle is registered
        $this->js = [
            'cpclearcache.js',
        ];

        $this->css = [
            'cpclearcache.css',
        ];

        parent::init();
    }
}
