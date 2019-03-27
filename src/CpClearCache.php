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

use Craft;
use craft\base\Plugin;
use craft\base\UtilityInterface;
use craft\events\RegisterCpNavItemsEvent;
use craft\services\Plugins;
use craft\web\Application;
use craft\web\assets\utilities\UtilitiesAsset;
use craft\web\twig\variables\Cp;
use craft\web\View;

use yii\base\Event;
use yii\base\InvalidConfigException;

use mmikkel\cpclearcache\CpClearCacheBundle;

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
    // Static Properties
    // =========================================================================

    /**
     * @var CpClearCache
     */
    public static $plugin;

    // Public Properties
    // =========================================================================

    /**
     * @var string
     */
    public $schemaVersion = '1.0.0';

    // Public Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    public function init()
    {

        parent::init();
        self::$plugin = $this;

        if (Craft::$app->getRequest()->getIsConsoleRequest() || !Craft::$app->getUser()->getIdentity() || !Craft::$app->getRequest()->getIsCpRequest()) {
            return;
        }

        Craft::$app->on(Application::EVENT_INIT, [$this, 'doIt']);

    }

    /**
     *
     */
    protected function doIt()
    {
        $utilitiesService = Craft::$app->getUtilities();

        /** @var UtilityInterface $clearCachesUtility */
        $clearCachesUtility = $utilitiesService->getUtilityTypeById('clear-caches');
        if ($clearCachesUtility === null || $utilitiesService->checkAuthorization($clearCachesUtility) === false) {
            return;
        }

        // Register alias
        Craft::setAlias('@mmikkel/cpclearcache', __DIR__);

        // Register asset bundle
        Event::on(
            View::class,
            View::EVENT_BEGIN_BODY,
            function () use ($clearCachesUtility) {
                try {
                    $html = $clearCachesUtility::contentHtml();
                    if (!$html) {
                        return;
                    }
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

}
