<template>
  <section>
    <h1>FileExplorer</h1>
    <vue-dropzone
      ref="vueDropzone"
      id="dropzone"
      :options="dropzoneOptions"
      v-on:vdropzone-sending="sendingHandler"
      class="bg-secondary border-secondary">
    </vue-dropzone>
    <pre>{{children}}</pre>
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
      path: '/',
      children: [],
    };
  },
  methods: {
    sendingHandler(file, _xhr, formData) {
      if(file.fullPath){
        const pathNoFile = file.fullPath.replace(/\/[^/]*$/, '/');
        formData.append('path', this.path + pathNoFile);
      } else {
        formData.append('path', this.path);
      }
    }
  },
  mounted() {
    let url = new URL(`${API_URL}api/v1/files`);
    const params = {path: this.path};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    fetch(url, {
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    }).then(res => res.json())
    .then(children => this.children = children);
  }
}
</script>

<style>
</style>
