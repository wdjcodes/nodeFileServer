<template>
  <div id="app">
    <Navigation></Navigation>
    <router-view class="container pt-2"/>
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue';

export default {
  components: {
    Navigation,
  },
  methods: {
    checkLogin() {
      this.isLoggedIn().then((auth) => {
        if (!auth) {
          this.logOutAndRedirect();
        }
      });
    },
    logOutAndRedirect() {
      this.logOut();
      this.$router.push('/');
    },
  },
  created() {
    this.checkLogin();
  },
};
</script>


<style lang="scss">
$web-font-path: "";

@import "~bootswatch/dist/superhero/variables";
@import "~bootstrap/scss/bootstrap";
@import "~bootswatch/dist/superhero/bootswatch";
@import "./styles/material-design-styles";
</style>
