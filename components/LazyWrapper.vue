<script>
  import Placeholder from './Placeholder';

  export default {
    functional: true, 
    props: {
      loading: {
        type: Boolean,
      }
    },
    render(createElement, { props, children }) {
      return props.loading ? createElement(Placeholder) : children;
    }
  }
</script>