(function ($) {
    function FormChangeDetector($form) {
        this.$form = $form;
        this.hasFormChanged = false;
        this.eventFunction= () => {
            this.checkValues();
        }
    }

    FormChangeDetector.prototype = {
        init: function () {
            var $self = this;
            // onChange/onNoChangeのイベントの発生の制御
            $self.$form.find('input, textarea, select').each(function () {
                var $this = $(this);
                var thisTagName = $this[0].tagName.toLowerCase();
                if (thisTagName === 'input' && ($this.prop('type') === 'radio' || $this.prop('type') === 'checkbox')) {
                    $this.data('initialValue', $this.is(':checked'));
                } else {
                    $this.data('initialValue', $this.val());
                }
                if (thisTagName === 'textarea' || (thisTagName === 'input' && $this.prop('type') === 'text')) {
                    $this.on('keyup', $self.eventFunction);
                } else {
                    $this.on('change', $self.eventFunction);
                }
            });
        },
        checkValues: function () {
            var isFormChange = false;
            this.$form.find('input:not(:submit, :button), textarea, select').filter(':enabled').each(function () {
                var $this = $(this);

                if ($this.prop('type') === 'radio' || $this.prop('type') === 'checkbox') {
                    if ($this.is(':checked') !== $this.data('initialValue')) {
                        isFormChange = true;
                        console.log($this.prop('name')+'|'+$this.data('initialValue')+'|'+$this.is(':checked')+'\n');
                        return false;
                    }
                } else {
                    if ($this.data('initialValue') !== $this.val()) {
                        isFormChange = true;
                        console.log($this.prop('name')+'|'+$this.data('initialValue')+'|'+$this.val()+'\n');
                        return false;
                    }
                }
            });
            this.fireEvents.call(this, isFormChange);
        },
        fireEvents: function (isFormChange) {
            if (isFormChange && !this.hasFormChanged) {
                this.$form.trigger("onChange");
            } else if (!isFormChange && this.hasFormChanged) {
                this.$form.trigger("onNoChange");
            }
            this.hasFormChanged = isFormChange;
        },
        removeEvent: function () {
          var $self = this;
          // onChange/onNoChangeのイベントの発生の制御
          this.$form.find('input, textarea, select').each(function () {
              var $this = $(this);
              var thisTagName = $this[0].tagName.toLowerCase();
              $this.removeData('initialValue');
              if (thisTagName === 'textarea' || (thisTagName === 'input' && $this.prop('type') === 'text')) {
                  $this.off('keyup');
              } else {
                  $this.off('change');
              }
          });
        }
    };
    $.fn.addFormChangeDetector = function () {
        var formChangeDetector = new FormChangeDetector(this);
        formChangeDetector.init();
        return this;
    };
    $.fn.removeFormChangeDetector = function () {
        var formChangeDetector = new FormChangeDetector(this);
        formChangeDetector.removeEvent();
        return this;
    };
})(jQuery);
