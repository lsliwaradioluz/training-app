<template>
  <div>
    <Navigation @scroll="scrollTo($event)" />
    <Header />
    <div ref="howto">
      <HowTo />
    </div>
    <div ref="author">
      <Author />
    </div>
    <Technologies />
    <div ref="contact">
      <Footer />
    </div>
  </div>
</template>

<script>
import Navigation from '~/components/website/Navigation'
import Header from '~/components/website/Header'
import HowTo from '~/components/website/HowTo'
import Author from '~/components/website/Author'
import Technologies from '~/components/website/Technologies'
import Footer from '~/components/website/Footer'

export default {
  layout: "website",
  components: { Navigation, Header, HowTo, Author, Technologies, Footer },
  methods: {
    scrollTo(targetName) {
      this.$refs[targetName].scrollIntoView({ behavior: 'smooth' });
    }
  }
};
</script>
