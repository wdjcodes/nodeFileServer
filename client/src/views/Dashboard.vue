<template>
  <section>
    <h1>Dashboard</h1>
    <section class="row mt-3">
      <div
        class="col-4 mb-3 pr-0 pl-3"
        v-for="page in pages"
        :key="page.route">
          <card-link :route="page.route">
            <div class="card-header">
              <div class="row">
                <h4 class="col-10">{{page.name}}</h4>
              </div>
            </div>
            <img
              class="card-img-bottom p-2"
              :src="page.imgUrl"
              :alt="page.imgAltText">
          </card-link>
      </div>
    </section>
  </section>
</template>

<script>
import CardLink from '@/components/CardLink';
import Images from '@/assets/images.js';

export default {
  data() {
    return {
      hover: false,
      pages: [
        {
          name: 'Notes',
          route: '/notes',
          imgUrl: Images.notes,
          imgAltText: 'notes.png',
        },
      ],
    };
  },
  components: {
    CardLink,
  },
};
</script>

<style lang=css>
</style>
