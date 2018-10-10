<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="collapse navbar-collapse" id="navbarColor01">
        <div class="navbar-nav mr-auto">
          <router-link to="/" class="navbar-brand">nodeFiles</router-link>
          <router-link class="nav-item active nav-link my-auto" to="/">Home</router-link>
        </div>
        <div class="navbar-nav">
          <router-link v-if='loggedIn' to="/dashboard" class="navbar-brand">{{user.username}}</router-link>
          <router-link v-if='!loggedIn' to="/login" class="btn btn-secondary">Login</router-link>
          <button v-if='loggedIn' @click="logout" class="btn btn-secondary">Logout</button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import EventBus from '../eventbus';

export default {
  data: () => ({
    loggedIn: false,
    user: {},
  }),
  methods: {
    logout() {
      localStorage.removeItem('token');
      EventBus.$emit('forceUpdate');
      this.$router.push('/');
    },
  },
  created() {
    EventBus.$on('loggedIn', (loggedIn) => {
      this.loggedIn = loggedIn;
    });
    EventBus.$on('user', (user) => {
      this.user = user;
    });
  },
};
</script>

<style>

</style>
