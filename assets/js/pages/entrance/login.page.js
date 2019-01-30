parasails.registerPage('login', {
  data: {
    syncing: false,
    formData: {
      captchaResponse: undefined
    },
    formErrors: {/* … */},
    formRules: {
      emailAddress: {required: true, isEmail: true},
      password: {required: true},
    },
    cloudError: '',
    needCaptcha: false,
    captchaWidgetId: null
  },
  beforeMount: function () {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    this.needCaptcha = this.needVerifyCaptcha;
  },
  mounted: function () {
    this.renderCaptCha();
  },
  methods: {
    submittedForm: async function (payload) {
      this.syncing = true;
      if (payload && payload.redirectTo) {
        window.location = payload.redirectTo;
        return;
      }
      window.location = '/';
    },
    formRejected: function (error) {
      if (error.exit == 'maxAttemptExceed' || error.exit == 'captchaNotVerified') {
        this.needCaptcha = true;
        this.renderCaptCha();
      }
    },
    renderCaptCha: function () {
      var self = this;
      var doRender = function () {
        var grecaptcha = window.grecaptcha;
        if (self.captchaWidgetId !== null && self.captchaWidgetId !== undefined) {
          grecaptcha.reset(self.captchaWidgetId);
        } else {
          var ref = self.$refs.captchaVerify;
          self.captchaWidgetId = grecaptcha.render(ref, {
            callback: function (response) {
              self.captchaCallback(response);
            },
            'expired-callback': function () {
              self.renderCaptCha();
            },
            'error-callback': function () {
              self.renderCaptCha();
            }
          });
        }
      };
      if (window.grecaptcha && window.grecaptcha.render) {
        doRender();
      } else {
        var captchaReady = function () {
          doRender();
          document.removeEventListener('grecaptcha--ready', captchaReady);
        };
        document.addEventListener('grecaptcha--ready', captchaReady);
      }
    },
    captchaCallback: function (response) {
      this.formData.captchaResponse = response;
    }
  }
});
