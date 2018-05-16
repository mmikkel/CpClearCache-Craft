(function (window) {

    if (!window.Craft || !window.jQuery) {
        return false;
    }

    Craft.CpClearCachePlugin = {

        hud: null,
        $trigger: null,
        localStorageKey: 'cpclearcache_selected',

        onChange: function (e) {
            Craft.setLocalStorage(this.localStorageKey, $.map($('input[type="checkbox"]:checked'), function (input) {
                return input.value;
            }));
        },

        onClick: function (e) {

            e.preventDefault();

            $form = $(this.data.html);
            $form.attr('id', 'mmikkel-cpclearcache');

            if (!this.hud) {

                var _self = this;

                this.hud = new Garnish.HUD(this.$trigger, $form, {
                    orientations: ['top', 'bottom', 'right', 'left'],
                    hudClass: 'hud toolhud',
                    onShow: function () {
                        Garnish.requestAnimationFrame(function () {
                            new Craft.ClearCachesUtility('mmikkel-cpclearcache');
                            var $checkboxes = $('#mmikkel-cpclearcache .checkbox-select');
                            new Garnish.CheckboxSelect($checkboxes);
                            var checkedBoxes = Craft.getLocalStorage(_self.localStorageKey);
                            $checkboxes.find('input[type="checkbox"]').each(function () {
                                $(this).prop('checked', checkedBoxes === undefined || checkedBoxes.indexOf(this.value) > -1).trigger('change');
                            });
                        });
                    }
                });

            } else {
                this.hud.updateBody($form);
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
            
            $('body').on('change', '#mmikkel-cpclearcache input[type="checkbox"]', $.proxy(this.onChange, this));

        }

    };

} (window));
