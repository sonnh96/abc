define(function () {

  var percentStringRegex = /^(\d+(\.\d+))\s*%$/;

  return {
    percentStringToNumber: function (s, defaultVal) {
      if (!defaultVal) {
        defaultVal = 0;
      }
      var matches = percentStringRegex.exec(s);
      if (matches && matches.length === 3) {
        return parseFloat(matches[1]);
      }
      return defaultVal;
    }
  }
});
