<template>
  <div class="bg-light d-flex flex-column">
    <div class="bg-secondary d-flex flex-row px-2">
      <h3 class="mt-1 mb-0">FileExplorer</h3>
      <div class="vlb-light"/>
      <div
        v-for="dir in path"
        :key="dir._id"
        class="d-flex flex-row flex-nowrap align-items-center" >
        <text-button @click.native="parentClicked(dir)">
          <h4 class="mt-1 mb-0">{{dir.name.substring(0, dir.name.length-1)}}</h4>
        </text-button>
        <div>
          <h4 class="mt-1 mb-0 text-primary">/</h4>
        </div>
      </div>
    </div>
    <div
      v-for="child in children"
      :key="child._id">
      <row-button @click.native="childClicked(child)">
        <i v-if="child.type === 'directory'" class="material-icons">folder</i>
        <i v-if="child.type === 'file'" class="material-icons">insert_drive_file</i>
        <div class="vlb-dark"/>
        <h5 class="mt-2 mb-0">{{child.name}}</h5>
      </row-button>
    </div>
  </div>
</template>

<script>
import EventBus from '@/eventbus';
import TextButton from '@/components/TextButton';
import RowButton from '@/components/RowButton';

const API_URL = 'http://localhost:5000/';

export default {
  components: {
    TextButton,
    RowButton,
  },
  data() {
    return {
      children: [],
      activeDirectoryId: null,
      path: [],
    };
  },
  watch: {
    activeDirectoryId: {
      handler() {
        EventBus.$emit('ActiveDirectoryUpdate', this.activeDirectoryId);
      },
    },
  },
  methods: {
    updateFiles() {
      const url = new URL(`${API_URL}api/v1/files`);
      const params = {};
      if (this.activeDirectoryId) {
        params.id = this.activeDirectoryId;
      }
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
      return fetch(url, {
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then(res => res.json())
        .then((response) => {
          this.activeDirectoryId = response.parentId;
          this.children = response.children;
          return this.activeDirectoryId;
        });
    },
    childClicked(child) {
      switch (child.type) {
        case 'directory':
          this.activeDirectoryId = child._id;
          this.updateFiles();
          this.path.push(child);
          break;
        default:
      }
    },
    parentClicked(parent) {
      const parentIndex = this.path.indexOf(parent);
      if (parentIndex >= 0 && parentIndex < this.path.length - 1) {
        this.path.splice(parentIndex + 1, this.path.length - parentIndex - 1);
        this.activeDirectoryId = this.path[parentIndex]._id;
        this.updateFiles();
      }
    },
  },
  created() {
    EventBus.$on('FilesUpdate', this.updateFiles);
    this.updateFiles().then((id) => {
      this.path.push({ _id: id, name: 'root:/' });
    });
  },
};
</script>

<style lang="scss">
</style>
