<template>
    <div>
      <div
        v-if="!hover"
        @mouseover="hover = true"
        class="card border-primary mb-3">
        <slot></slot>
      </div>
      <div
        v-if="hover"
        class="card text-muted bg-primary mb-3"
        @mouseover="hover = true"
        @mouseout="hover = false"
        @click="pushRoute(route)">
        <slot></slot>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      hover: false,
    };
  },
  props: {
    route: {
      type: String,
      required: true,
    },
  },
  methods: {
    pushRoute(route) {
      this.$router.push(route);
    },
  },
};
</script>

<style>
</style>
