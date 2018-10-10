<template>
  <section>
    <h1>Dashboard</h1>
    <h1>Hello, {{user.username}}! 👋</h1>
    <button @click="logout" class="btn btn-primary">Logout</button>
    <button v-if="!showForm" @click="showForm = !showForm" class="btn btn-primary">Show Form</button>
    <button v-if="showForm" @click="showForm = ! showForm" class="btn btn-secondary">Hide Form</button>
    <form v-if="showForm" @submit.prevent="addNote()">
      <div class="form-group">
        <label for="title">Title</label>
        <input
        v-model="newNote.title"
        type="text"
        class="form-control"
        id="title"
        aria-describedby="titleHelp"
        placeholder="Enter title" required>
        <small id="titlelHelp" class="form-text text-muted">Eneter a descriptive title for your note.</small>
      </div>
      <div class="form-group">
        <label for="noteText">Note</label>
        <textarea
          v-model="newNote.note"
          class="form-control"
          id="noteText"
          rows="3"
          placeholder="Type your note..." required
        ></textarea>
      </div>
      <button type="submit" class="btn btn-primary btn-lg">Submit</button>
    </form>
  </section>
</template>

<script>
import EventBus from '../eventbus';

const API_URL = 'http://localhost:5000/';

export default {
  data: () => ({
    user: {},
    newNote: {
      title: '',
      note: '',
    },
    showForm: false,
  }),
  created() {
    EventBus.$on('loggedIn', (loggedIn) => {
      this.loggedIn = loggedIn;
    });
    EventBus.$on('user', ((user) => {
      this.user = user;
    }));
  },
  mounted() {
    if (!this.loggedIn) {
      this.$router.push('/login');
    }
  },
  // mounted(){
  //   fetch(API_URL, {
  //     headers: {
  //       authorization: 'Bearer ' + localStorage.token,
  //     }
  //   }).then(res => res.json())
  //   .then((result) => {
  //     if(result.user){
  //       this.user = result.user;
  //     } else {
  //       this.logout();
  //     }
  //   });
  // },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
    addNote() {
      console.log(this.newNote);
    },
  },
};
</script>

<style>

</style>
