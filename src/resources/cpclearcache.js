(function (window) {

    if (!window.Craft || !window.jQuery) {
        return false;
    }

    Craft.CpClearCachePlugin = {

        hud: null,
        $trigger: null,

        onClick: function (e) {

            e.preventDefault();

            var $form = $(this.data.html);
            $form.attr('id', 'mmikkel-cpclearcache');

            if (!this.hud) {

                this.hud = new Garnish.HUD(this.$trigger, $form, {
                    orientations: ['top', 'bottom', 'right', 'left'],
                    hudClass: 'hud toolhud',
                    onShow: function () {
                        Garnish.requestAnimationFrame(function () {
                            new Craft.ClearCachesUtility('mmikkel-cpclearcache');
                            new Garnish.CheckboxSelect($('#mmikkel-cpclearcache .checkbox-select'));
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

        }

    };

} (window));
