<template>
    <div>
      <div
        class="card mb-3"
        :class="cardClass"
        @mouseover="onMouseOver"
        @mouseout="onMouseOut"
        @click="pushRoute(route)">
        <slot></slot>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      cardClass: ['border-primary'],
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
    onMouseOver(){
      this.cardClass = ['bg-primary', 'text-muted', 'card-hover'];
    },
    onMouseOut(){
      this.cardClass = ['border-primary'];
    },
  },
};
</script>

<style>
.card.card-hover {
  cursor: pointer;
}
</style>
