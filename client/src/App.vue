<template>
  <div id="app">
    <!-- <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a class="navbar-brand" href="#">Auth File Server</a>
    </nav> -->
    <Navigation></Navigation>
    <router-view class="container pt-2"/>
  </div>
</template>

<script>
  import Navigation from './components/Navigation.vue';
  export default {
    components: {
    'Navigation': Navigation,
    },
  }
</script>


<style>

</style>
