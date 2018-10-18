<template>
  <section>
    <h1>FileExplorer</h1>
    <vue-dropzone
      ref="vueDropzone"
      id="dropzone"
      :options="dropzoneOptions">
    </vue-dropzone>
  </section>
</template>

<script>
import VueDropzone from 'vue2-dropzone';

export default {
  components: {
    VueDropzone,
  },
  data() {
    return {
      dropzoneOptions: {
        url: `${this.API_URL}api/v1/files/`,
        thumbnailWidth: 150,
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      },
    };
  },
}
</script>

<style>
</style>
