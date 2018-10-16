<template>
  <div id="app">
    <Navigation></Navigation>
    <router-view class="container pt-2"/>
  </div>
</template>

<script>
import EventBus from './eventbus';

import Navigation from './components/Navigation.vue';

export default {
  components: {
    Navigation,
  },
  methods: {
    checkLogin() {
      this.isLoggedIn().then((auth) => {
        if(!auth){
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


<style>
</style>
