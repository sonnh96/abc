parasails.registerPage('unconfirmed', {
  data: {
    syncing: false,
    formData: {},
    aMinute: 60 * 1000,
    lastSent: -1,
    currentTick: -1,
    tickToken: null
  },
  computed: {
    canResend: function () {
      if (this.lastSent === -1) {
        return true;
      }
      return this.currentTick - this.lastSent > this.aMinute;
    },
    timeLeft: function () {
      const left = this.aMinute - (this.currentTick - this.lastSent);
      return Math.floor(left / 1000);
    }
  },
  methods: {
    formSubmitted: function (payload) {
      if (payload && payload.redirect) {
        window.location = payload.redirect;
        return;
      }
      this.lastSent = (new Date()).getTime();
      this.currentTick = (new Date()).getTime();
      if (this.tickToken) {
        return;
      }
      this.tickToken = setInterval(() => {
        this.currentTick = (new Date()).getTime();
      }, 500);
    }
  },
  beforeDestroy: function () {
    if (this.tickToken) {
      clearInterval(this.tickToken);
    }
  }
});
