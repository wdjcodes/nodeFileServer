<template>
  <section>
    <h1>Dashboard</h1>
    <section class="row mt-3">
      <div
        class="col-3 mb-3 pr-0 pl-3"
        v-for="page in pages"
        :key="page.route">
          <card-link :route="page.route">
            <div class="card-header">
              <div class="row">
                <h4 class="col-10">{{page.name}}</h4>
              </div>
            </div>
            <div class="d-flex flex-row justify-content-center align-items-center">
              <i class="material-icons icon-size-128">{{page.icon}}</i>
            </div>
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
          icon: 'event_note',
          imgUrl: Images.notes,
          imgAltText: 'notes.png',
        },
        {
          name: 'FileExplorer',
          route: '/files',
          icon: 'find_in_page',
          imgUrl: Images.search,
          imgAltText: 'search.png',
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
.card-img-container {
  height: 250px;
  width: 100%;
  overflow: hidden;
}

.my-card-img {
  width: 75%;
  height: auto;
}
</style>
