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
    <section class="row mt-3">
      <div
        class="col-4 mb-3 pr-0 pl-3"
        v-for="note in notes"
        :key="note._id">
        <div
          class="card border-primary mb-3">
          <div class="card-header">
            <div class="row">
              <h4 class="col-10">{{note.title}}</h4>
              <div class="col-1 dropdown btn-group">
                <button 
                  id="noteOptions" 
                  type="button" 
                  class="btn btn-outline-primary dropdown-toggle card-btn-toggle"
                  data-toggle="dropdown" 
                  aria-haspopup="true" 
                  aria-expanded="false">
                </button>
                <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                  <a class="dropdown-item" href="#">Dropdown link</a>
                  <a class="dropdown-item" href="#">Dropdown link</a>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body">
            <p class="card-text" v-html="renderMarkDown(note.note)"></p>
          </div>
          <div class="footer mr-2 mb-1 text-muted text-right">
            {{readableTime(note.create_time)}}
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import EventBus from '../eventbus';
import markDown from 'markdown-it';
import mdEmoji from 'markdown-it-emoji';

const md = new markDown();
md.use(mdEmoji);

const API_URL = 'http://localhost:5000/';

export default {
  data: () => ({
    user: {},
    newNote: {
      title: '',
      note: '',
    },
    showForm: false,
    notes: [],
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
    this.getNotes();
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
    addNote() {
      fetch(`${API_URL}api/v1/notes`, {
        method: 'POST',
        body: JSON.stringify(this.newNote),
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then(res => res.json())
        .then((note) => {
          console.log(note);
          this.newNote.title = '';
          this.newNote.note = '';
          this.showForm = false;
          this.getNotes();
        });
    },
    getNotes() {
      fetch(`${API_URL}api/v1/notes`, {
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res => res.json()))
        .then((notes) => {
          console.log(notes);
          this.notes = notes;
        });
    },
    renderMarkDown(note) {
      return md.render(note);
    },
    readableTime(time){
      const d = new Date(time);
      return d.toLocaleString();
    }
  },
};
</script>

<style>
.card {
  height: 100%;
}
.card-text img {
  width: 100%;
}
.card-btn-toggle {
  height: 35px;
  vertical-align: top;
}
/* .btn .btn-outline-primary .dropdown-toggle{
  width: 100%;
  height: 100%;
  border: none;
  font-family: 'Glyphicons Halflings';
}
.custom-caret {
  font-family: 'Glyphicons Halflings';
  content: "\f107";
} */

/* .bootstrap-select.btn-group .dropdown-toggle .caret {
  width: 100%;
  height: 100%;
  border: none;
  font-family: 'Glyphicons Halflings';
} */
</style>
