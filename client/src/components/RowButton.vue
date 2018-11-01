<template>
  <div
    type="button"
    class="d-flex flex-row border-bottom border-dark pl-2 height-100"
    :class="activeClass"
    @mouseover="onMouseOver"
    @mouseout="onMouseOut">
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeClass: [],
    };
  },
  props: {
    tbStyle: {
      required: false,
      dafault: 'tb-light',
    },
  },
  methods: {
    onMouseOver() {
      this.activeClass = ['bg-primary', 'border-primary', 'text-muted', 'hover'];
    },
    onMouseOut() {
      this.activeClass = [];
    },
  },
  created() {
    if (this.tbStyle === 'tb-light' || this.tbStyle === 'tb-dark') {
      this.activeClass.push(this.tbStyle);
    } else {
      this.activeClass.push('tb-light');
    }
  },
};
</script>

<style>
.hover {
  cursor: pointer;
}
</style>
