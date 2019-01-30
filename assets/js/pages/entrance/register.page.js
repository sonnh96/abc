parasails.registerPage('register', (function () {
  var registerDialog = {
    data: function () {
      return {
        registerDialog: {
          formData: {},
          formErrors: {},
          cloudError: '',
          shown: false,
          syncing: false,
          creating: true
        }
      }
    },
    methods: {
      handleParsingRegisterForm: function () {

      },
      cleanRegisterDialogForm: function () {
        var modal = this.registerDialog;
        modal.shown = false;
        modal.formErrors = {};
        modal.cloudError = '';
      },
      testRe: function (payload) {

      }
    }
  };
  return {
    mixins: [registerDialog],
    data: {
      plan: []
    },
    computed: {
      availablePermissionsMap: function () {
        console.log("test222222");
      }
    },
    methods: {
      settlementDirect: function (type) {
        var self = this;
        Cloud['register'].with({
          id: type.id,
          price: type.price,
          rebill_param_id: type.rebill_param_id
        }).then(function (payload) {
          self.redirectPost(payload.url, payload.param);
        });
      },
      redirectPost: function (location, args) {
        var form = '';
        $.each(args, function (key, value) {
          form += '<input type="hidden" name="' + key + '" value="' + value + '">';
        });
        $('<form action="' + location + '" method="POST">' + form + '</form>').appendTo($(document.body)).submit();
      }
    },
    beforeMount: function () {
      this.plan = SAILS_LOCALS.locals;
    }
  };
})());
