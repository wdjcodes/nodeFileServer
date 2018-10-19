<template>
  <section>
    <h1>FileExplorer</h1>
    <vue-dropzone
      ref="vueDropzone"
      id="dropzone"
      :options="dropzoneOptions"
      v-on:vdropzone-sending="sendingHandler">
    </vue-dropzone>
  </section>
</template>

<script>
import VueDropzone from 'vue2-dropzone';

const API_URL = 'http://localhost:5000/';

export default {
  components: {
    VueDropzone,
  },
  data() {
    return {
      dropzoneOptions: {
        url: `${API_URL}api/v1/files/`,
        thumbnailWidth: 150,
        paramName: 'uploads',
        addRemoveLinks: true,
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      },
    };
  },
  methods: {
    sendingHandler(file, _xhr, formData) {
      if(file.fullPath){
        formData.append("fullPath", file.fullPath);
      }
    }
  }
}
</script>

<style>
</style>
