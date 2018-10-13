<template>
  <div class="home">
    <div class="jumbotron">
      <h1 class="display-3">Auth File Server</h1>
      <p class="lead">Learning Auth to use for file server.</p>
      <hr class="my-4">
      <p>Learning from coding garden</p>
      <p class="lead">
        <router-link
          class="btn btn-primary btn-lg"
          :to="{name: 'signup'}"
          role="button">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
};
</script>
