<?php
/**
 * CP Cache QuickMenu plugin for Craft CMS 5.x
 *
 * Fewer clicks to get clearin'
 *
 * @link      https://vaersaagod.no
 * @copyright Copyright (c) 2018 Mats Mikkel Rummelhoff
 */

namespace mmikkel\cpclearcache;

use Craft;
use craft\base\Plugin;
use craft\events\RegisterCpNavItemsEvent;
use craft\helpers\ArrayHelper;
use craft\utilities\ClearCaches;
use craft\web\assets\utilities\UtilitiesAsset;
use craft\web\twig\variables\Cp;
use craft\web\View;

use yii\base\Event;
use yii\web\View as ViewAlias;

/**
 * Class CpClearCache
 *
 * @author    Mats Mikkel Rummelhoff
 * @package   CpClearCache
 * @since     1.0.0
 *
 */
class CpClearCache extends Plugin
{

    /**
     * @return void
     */
    public function init(): void
    {

        parent::init();

        // Register alias
        Craft::setAlias('@mmikkel/cpclearcache', __DIR__);

        $request = Craft::$app->getRequest();

        if (!$request->getIsCpRequest() || !$request->getIsGet() || $request->getIsLoginRequest()) {
            return;
        }

        Craft::$app->onInit(function () {
            try {
                $this->doIt();
            } catch (\Throwable $e) {
                Craft::error($e, __METHOD__);
            };
        });

    }

    /**
     * @return void
     * @throws \Throwable
     */
    protected function doIt(): void
    {

        if (!Craft::$app->getUser()->getIdentity()) {
            return;
        }

        // Get the Clear Caches utility and check that the current user has access to it
        $utilitiesService = Craft::$app->getUtilities();
        $clearCachesUtility = $utilitiesService->getUtilityTypeById('clear-caches');
        if ($clearCachesUtility === null || $utilitiesService->checkAuthorization($clearCachesUtility) === false) {
            return;
        }

        // Register asset bundle
        Event::on(
            View::class,
            ViewAlias::EVENT_BEGIN_BODY,
            function () {
                try {
                    $html = $this->_getClearCachesUtilityHtml();
                    $html = "<div>$html</div>";
                    $view = Craft::$app->getView();
                    $view->registerAssetBundle(UtilitiesAsset::class);
                    $view->registerAssetBundle(CpClearCacheBundle::class);
                    $view->registerJs('if (Craft.CpClearCachePlugin) { Craft.CpClearCachePlugin.init(' . json_encode(['html' => $html]) . '); };', View::POS_READY);
                } catch (\Throwable $e) {
                    Craft::error(
                        'Error registering AssetBundle - ' . $e->getMessage(),
                        __METHOD__
                    );
                }
            }
        );

        // Add CP nav menu item
        Event::on(Cp::class, Cp::EVENT_REGISTER_CP_NAV_ITEMS, function (RegisterCpNavItemsEvent $event) {
            $event->navItems['mmikkel/cpclearcache'] = [
                'label' => \Craft::t('app', 'Clear Caches'),
                'fontIcon' => 'trash',
                'url' => 'mmikkel/cpclearcache'
            ];
        });
    }

    /**
     * @return string
     * @throws \Twig\Error\LoaderError
     * @throws \Twig\Error\RuntimeError
     * @throws \Twig\Error\SyntaxError
     * @throws \yii\base\Exception
     */
    private function _getClearCachesUtilityHtml(): string
    {
        $cacheOptions = [];
        $tagOptions = [];

        foreach (ClearCaches::cacheOptions() as $cacheOption) {
            $cacheOptions[] = [
                'label' => $cacheOption['label'],
                'value' => $cacheOption['key'],
                'info' => $cacheOption['info'] ?? null,
            ];
        }

        foreach (ClearCaches::tagOptions() as $tagOption) {
            $tagOptions[] = [
                'label' => $tagOption['label'],
                'value' => $tagOption['tag'],
            ];
        }

        ArrayHelper::multisort($cacheOptions, 'label');
        $view = Craft::$app->getView();

        return $view->renderTemplate('_components/utilities/ClearCaches', [
            'cacheOptions' => $cacheOptions,
            'tagOptions' => $tagOptions,
        ]);
    }

}
