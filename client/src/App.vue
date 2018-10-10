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
    isloggedIn() {
      if (!localStorage.token) {
        this.loggedIn = false;
        EventBus.$emit('loggedIn', this.loggedIn);
      } else {
        fetch(API_URL, {
          headers: {
            authorization: `Bearer ${localStorage.token}`,
          },
        }).then(res => res.json())
          .then((result) => {
            if (result.user) {
              this.user = result.user;
              this.loggedIn = true;
              EventBus.$emit('loggedIn', this.loggedIn);
              EventBus.$emit('user', this.user);
            } else {
              this.logout();
            }
          });
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.loggedIn = false;
      this.user = {};
      EventBus.$emit('loggedIn', this.loggedIn);
      EventBus.$emit('user', this.user);
      this.$router.push('/login');
    },
  },
  created() {
    console.log('Create');
    this.isloggedIn();
  },
  mounted() {
    EventBus.$on('forceUpdate', () => {
      console.log('Forced Update');
      this.isloggedIn();
    });
  },
  updated() {
    console.log('Update');
    this.isloggedIn();
  },
  data: () => ({
    loggedIn: false,
    user: {},
  }),
};
</script>


<style>

</style>
