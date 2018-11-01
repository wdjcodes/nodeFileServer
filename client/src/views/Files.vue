<template>
  <section>
    <div class="d-flex flex-row pr-3">
      <text-button
        class="ml-auto"
        v-if="!uploading"
        @click.native="uploading = true">
        <i class="material-icons">cloud_upload</i>
      </text-button>
      <text-button
        class="ml-auto"
        v-if="uploading"
        @click.native="uploading = false">
        <i class="material-icons">not_interested</i>
      </text-button>
    </div>
    <vue-dropzone
      ref="vueDropzone"
      id="dropzone"
      :useCustomSlot=true
      :options="dropzoneOptions"
      @vdropzone-queue-complete="finishUpload"
      v-on:vdropzone-sending="sendingHandler"
      v-if="uploading"
      class="bg-secondary border-secondary text-light mb-3">
      <h3>Drop files here or click to upload.</h3>
    </vue-dropzone>
    <file-explorer/>
  </section>
</template>

<script>
import VueDropzone from 'vue2-dropzone';
import EventBus from '@/eventbus';
import FileExplorer from '@/components/FileExplorer';
import TextButton from '@/components/TextButton';

const API_URL = 'http://localhost:5000/';

export default {
  components: {
    VueDropzone,
    FileExplorer,
    TextButton,
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
      activeDirectoryId: null,
      uploading: false,
    };
  },
  methods: {
    sendingHandler(file, _xhr, formData) {
      if (file.fullPath) {
        const pathNoFile = file.fullPath.replace(/\/[^/]*$/, '/');
        formData.append('path', pathNoFile);
      }
      formData.append('activeDirectoryId', this.activeDirectoryId);
    },
    setUploading(bool) {
      this.uploading = bool;
    },
    finishUpload() {
      EventBus.$emit('FilesUpdate');
      setTimeout(() => { this.uploading = false; }, 1000);
    },
  },
  created() {
    EventBus.$on('ActiveDirectoryUpdate', (id) => {
      this.activeDirectoryId = id;
    });
  },
};
</script>

<style lang="scss">
</style>
