import Vue from 'vue';

Vue.mixin({
  methods: {
    removeWhitespace(string) {
      return string.replace(/ /g,'_');
    },
  }
});