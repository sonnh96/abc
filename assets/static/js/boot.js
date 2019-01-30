var vueInstance = {};
require.config({
  urlArgs: "hash=v15"
});

var vueAuto = new (function () {
  return {
    update: function () {
      $("div[vueapp]").each(function (i, e) {
        var e = $(e);
        var name = e.attr('vueapp');
        var idname = "[vueapp=" + name + "]";
        var script = e.attr('vuelogic') + ".js";
        require([script], function (source) {
          var z = new Vue({
            'el': idname,
            mixins: [source],
          });
          vueInstance[name] = z;
          window[name] = z;
          e.show();
        });
      });
    }
  }
});
$(vueAuto.update);
