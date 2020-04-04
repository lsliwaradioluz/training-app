import Vue from 'vue';

Vue.mixin({
  computed: {
    appMainColor() {
      return this.$store.state.main.mainColor;
    }
  },
  methods: {
    normalizeText(string) {
      return string.replace(/ą/g, 'a').replace(/Ą/g, 'A')
        .replace(/ć/g, 'c').replace(/Ć/g, 'C')
        .replace(/ę/g, 'e').replace(/Ę/g, 'E')
        .replace(/ł/g, 'l').replace(/Ł/g, 'L')
        .replace(/ń/g, 'n').replace(/Ń/g, 'N')
        .replace(/ó/g, 'o').replace(/Ó/g, 'O')
        .replace(/ś/g, 's').replace(/Ś/g, 'S')
        .replace(/ż/g, 'z').replace(/Ż/g, 'Z')
        .replace(/ź/g, 'z').replace(/Ź/g, 'Z');
    }, 
    generateUsername(fullname) {
      const splitFullname = fullname.toLowerCase().split(' ');
      const username = this.normalizeText(`${splitFullname[0][0]}${splitFullname[1]}`);
      return username;
    },
  }
});