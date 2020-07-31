(function (window) {

    if (!window.Craft || !window.jQuery) {
        return false;
    }

    Craft.CpClearCachePlugin = {

        hud: null,
        $trigger: null,
        localStorageKey: 'cpclearcache_selected',

        onChange: function () {
            Craft.setLocalStorage(this.localStorageKey, $.map($('#mmikkel-cpclearcache input[type="checkbox"]:checked'), function (input) {
                return input.value;
            }));
        },

        onClick: function (e) {

            e.preventDefault();

            var _this = this;

            var $html = $(this.data.html);
            $html.attr('id', 'mmikkel-cpclearcache');
            $('.info', $html).infoicon();

            $html.find('form').each(function (index) {
                this.id = this.id || 'mmikkel-cpclearcache-form-' + index;
                var $checkboxes = $(this).find('.checkbox-select');
                new Garnish.CheckboxSelect($checkboxes);
                var checkedBoxes = Craft.getLocalStorage(_this.localStorageKey);
                $checkboxes.find('input[type="checkbox"]').each(function () {
                    $(this).prop('checked', checkedBoxes === undefined || checkedBoxes.indexOf(this.value) > -1).trigger('change');
                });
            });

            if (!this.hud) {

                this.hud = new Garnish.HUD(this.$trigger, $html, {
                    orientations: ['top', 'bottom', 'right', 'left'],
                    hudClass: 'hud toolhud',
                    onShow: function () {
                        Garnish.requestAnimationFrame(function () {
                            $html.find('form').each(function () {
                                new Craft.ClearCachesUtility(this.id);
                            });
                        });
                    }
                });

            } else {
                this.hud.updateBody($html);
                this.hud.show();
            }

        },

        init: function (data) {

            this.data = data;

            this.$trigger = $('#nav-mmikkelcpclearcache a');

            if (!this.$trigger.length) {
                return;
            }

            this.$trigger.on('click', $.proxy(this.onClick, this));

            $('body')
                .on('change', '#mmikkel-cpclearcache input[type="checkbox"]', $.proxy(this.onChange, this))
                .on('click', '#mmikkel-cpclearcache .info', e => {
                    e.preventDefault();
                    e.stopPropagation();
                });

        }

    };

} (window));
