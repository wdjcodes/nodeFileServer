<template>
  <div id="app">
    <Navigation></Navigation>
    <router-view class="container pt-2"/>
  </div>
</template>

<script>
import EventBus from './eventbus';

import Navigation from './components/Navigation.vue';

const API_URL = 'http://localhost:5000/';
export default {
  components: {
    Navigation,
  },
  methods: {
    checkLogin() {
      this.isloggedIn().then((auth) => {
        if(!auth){
          this.logOutAndRedirect();
        }
      });
    },
    logOutAndRedirect() {
      this.logOut();
      this.$router.push('/login');
    },
  },
  created() {
    this.checkLogin();
  },
};
</script>


<style>

</style>
