import Vue from 'vue';

Vue.mixin({
  methods: {
    removeWhitespace(string) {
      return string.replace(/ /g,'_');
    },
    addWhitespace(string) {
      return string.replace(/_/g,' ');
    },
  }
});