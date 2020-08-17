<template>
  <div>
    <Navigation />
    <Header />
    <HowTo />
    <Author />
    <Technologies />
    <Footer />
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
};
</script>
