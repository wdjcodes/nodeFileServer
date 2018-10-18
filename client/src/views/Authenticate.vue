<template>
  <loading></loading>
</template>

<script>
import Loading from '@/components/Loading.vue';

export default {
  components: {
    Loading,
  },
  mounted() {
    if (this.finalTarget.path) {
      this.isLoggedIn()
        .then(() => {
          setTimeout(() => {
            this.$router.push({
              name: this.finalTarget.name,
              params: this.finalTarget.params,
              query: this.finalTarget.query,
            });
          }, this.TRANSITION_DELAY);
        });
    } else {
      this.$router.push('/');
    }
  },
};
</script>

<style>
</style>
