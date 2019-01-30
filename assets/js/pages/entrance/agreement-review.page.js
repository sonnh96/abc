parasails.registerPage('agreement-review', (function () {
  function niceNumber(num) {
    return num < 10 ? '0' + num : num;
  }

  function intToDate(num) {
    var date = new Date(num);
    date.setTime(num);
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    // var hour = date.getHours();
    // var minute = date.getMinutes();
    return year + '/' + niceNumber(month) + '/' + niceNumber(day)/* + ' ' + niceNumber(hour) + ':' + niceNumber(minute)*/;
  }

  return {
    data: {
      agreements: [],
      acceptRevisions: [],
      redirect: null,
      acceptDialog: {
        cloudError: '',
        syncing: false,
        showing: false,
        agreement: null,
        checked: false
      }
    },
    computed: {
      usedAcceptedIds: function () {
        return this.acceptRevisions.map(function (r) {
          return r.split('_')[0];
        })
      },
      isAccepted: function () {
        const acceptedRevisions = this.acceptRevisions;
        return function (agreement) {
          const revision = agreement.id + '_' + agreement.revision;
          return _.some(acceptedRevisions, function (r) {
            return r === revision;
          });
        }
      },
      isUsedToAccept: function () {
        const usedAcceptedIds = this.usedAcceptedIds;
        return function (agreement) {
          return _.some(usedAcceptedIds, function (id) {
            return agreement.id == id;
          });
        }
      },
      requiredTermRevisions: function () {
        return this.agreements.map(function (agreement) {
          return agreement.id + '_' + agreement.revision;
        });
      },
      isAcceptAll: function () {
        const acceptedRevisions = this.acceptRevisions;
        return _.every(this.requiredTermRevisions, function (testRevision) {
          return _.some(acceptedRevisions, function (r) {
            return r === testRevision;
          });
        });
      }
    },
    methods: {
      formSubmitted: function (payload) {
        this.agreements = payload.agreements;
        this.acceptRevisions = payload.acceptRevisions;
        this.$refs.agreementDlg.dismiss();
      },
      formPrepare: function () {
        return {
          id: this.acceptDialog.agreement.id,
          revision: this.acceptDialog.agreement.revision
        };
      },
      showAgreementDialog: function (agreement) {
        this.acceptDialog.agreement = agreement;
        this.acceptDialog.checked = false;
        this.acceptDialog.showing = true;
      },
      cleanDialog: function () {
        this.acceptDialog.agreement = null;
        this.acceptDialog.checked = false;
        this.acceptDialog.showing = false;
      },
      toEntrance: function () {
        var redirect = this.redirect;
        Cloud['unlockAgreement'].with({redirect: redirect}).then(function (payload) {
          window.location = payload.redirect;
        });
      }
    },
    mounted: function () {
      let queries = window.location.search;
      if (!queries) {
        return;
      }
      if (queries[0] === '?') {
        queries = queries.substring(1);
      }
      queries = queries.split('&').reduce(function (combined, query) {
        const keyVal = query.split('=');
        combined[decodeURIComponent(keyVal[0])] = decodeURIComponent(keyVal[1]);
        return combined;
      }, {});
      this.redirect = queries.redirect || '/login';
    },
    beforeMount: function () {
      _.extend(this, SAILS_LOCALS);
      this.agreements = this.locals.agreements.map(function (agreement) {
        agreement.createdAt = intToDate(agreement.createdAt);
        agreement.updatedAt = intToDate(agreement.updatedAt);
        return agreement;
      });
      this.acceptRevisions = this.locals.acceptRevisions;
    }
  }
})());
