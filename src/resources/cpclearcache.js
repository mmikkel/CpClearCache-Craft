(function (window) {

    if (!window.Craft || !window.jQuery) {
        return false;
    }

    Craft.CpClearCachesUtility = Garnish.Base.extend(
    {
        init: function (formId) {
            let $form = $('#' + formId);
            let $checkboxes = $form.find('input[type=checkbox]');
            let $btn = $form.find('.btn');
            let checkInputs = function () {
                if ($checkboxes.filter(':checked').length) {
                    $btn.removeClass('disabled');
                } else {
                    $btn.addClass('disabled');
                }
            };
            $checkboxes.on('change', checkInputs);
            checkInputs();
            this.addListener($form, 'submit', ev => {
                ev.preventDefault();
                if (!$btn.hasClass('disabled')) {
                    this.onSubmit(ev);
                }
            });
        },

        onSubmit: function (ev) {
            let $form = $(ev.currentTarget);
            let $trigger = $form.find('button.submit');
            let $status = $form.find('.utility-status');

            if ($trigger.hasClass('disabled')) {
                return;
            }

            let progressBar, $allDone;
            if (!$form.data('progressBar')) {
                progressBar = new Craft.ProgressBar($status);
                $form.data('progressBar', progressBar);
            } else {
                progressBar = $form.data('progressBar');
                progressBar.resetProgressBar();
                $allDone = $form.data('allDone');
            }

            progressBar.$progressBar.removeClass('hidden');

            progressBar.$progressBar.velocity('stop').velocity({
                opacity: 1
            }, {
                complete: $.proxy(function () {
                    let postData = Garnish.getPostData($form);
                    let params = Craft.expandPostArray(postData);

                    Craft.postActionRequest(params.action, params, (response, textStatus) => {
                        if (response && response.error) {
                            alert(response.error);
                        }

                        progressBar.setProgressPercentage(100);

                        setTimeout(() => {
                            if (!$allDone) {
                                $allDone = $('<div class="alldone" data-icon="done" />').appendTo($status);
                                $allDone.css('opacity', 0);
                                $form.data('allDone', $allDone);
                            }

                            progressBar.$progressBar.velocity({ opacity: 0 }, {
                                duration: 'fast', complete: () => {
                                    $allDone.velocity({ opacity: 1 }, { duration: 'fast' });
                                    $trigger.removeClass('disabled');
                                    $trigger.trigger('focus');
                                },
                            });
                        }, 300);
                    }, {
                        complete: $.noop
                    });
                }, this)
            });

            if ($allDone) {
                $allDone.css('opacity', 0);
            }

            $trigger.addClass('disabled');
            $trigger.trigger('blur');
        },
    });

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

            var $trigger = $(e.currentTarget);
            var _this = this;

            var $html = $(this.data.html);
            $html.attr('id', 'mmikkel-cpclearcache');
            $('.info', $html).infoicon();

            $html.find('form').each(function (index) {
                this.id = 'mmikkel-cpclearcache-form-' + index;
                var $checkboxes = $(this).find('.checkbox-select');
                new Garnish.CheckboxSelect($checkboxes);
                var checkedBoxes = Craft.getLocalStorage(_this.localStorageKey);
                $checkboxes.find('input[type="checkbox"]').each(function () {
                    $(this).prop('checked', checkedBoxes === undefined || checkedBoxes.indexOf(this.value) > -1).trigger('change');
                });
            });

            this.hud = new Garnish.HUD($trigger, $html, {
                orientations: ['top', 'bottom', 'right', 'left'],
                hudClass: 'hud toolhud',
                onShow: function () {
                    Garnish.requestAnimationFrame(function () {
                        $html.find('form').each(function () {
                            new Craft.CpClearCachesUtility(this.id);
                        });
                    });
                },
                onHide: function () {
                    _this.hud.destroy();
                    _this.hud = null;
                }
            });

        },

        init: function (data) {

            this.data = data;

            $('body').on('click', '#nav a[href*="mmikkel/cpclearcache"]', $.proxy(this.onClick, this));

            $('body')
                .on('change', '#mmikkel-cpclearcache input[type="checkbox"]', $.proxy(this.onChange, this))
                .on('click', '#mmikkel-cpclearcache .info', e => {
                    e.preventDefault();
                    e.stopPropagation();
                });

        }

    };

}(window));
