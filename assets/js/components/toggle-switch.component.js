parasails.registerComponent('toggle-switch', {
  props: {
    size: {
      default: 'normal'
    },
    value: {
      default: false
    }
  },
  template: `<label class="switch round">
  <input type="checkbox" v-model="isChecked" @change="valueChanged">
  <span class="slider"></span>
</label>`,
  data: function () {
    return {
      isChecked: false
    };
  },
  methods: {
    valueChanged: function (e) {
      this.$emit('input', e.target.checked);
    }
  },
  watch: {
    value: {
      handler: function () {
        this.isChecked = this.value;
      },
      immediate: true
    }
  }
});
