<template>
  <section>
    <h1>Dashboard</h1>
    <h1>Hello, {{user.username}}! 👋</h1>
    <button @click="logout" class="btn btn-primary">Logout</button>
    <button v-if="!showForm" @click="showForm = !showForm" class="btn btn-primary">Show Form</button>
    <button v-if="showForm" @click="showForm = ! showForm" class="btn btn-secondary">Hide Form</button>
    <NoteForm v-if="showForm"></NoteForm>
    <section class="row mt-3">
      <div
        class="col-4 mb-3 pr-0 pl-3"
        v-for="note in notes"
        :key="note._id">
        <NoteCard :note="note"></NoteCard>
      </div>
    </section>
    <!-- Modals -->
    <EditNote></EditNote>
    <DeleteModal></DeleteModal>
  </section>
</template>

<script>
import EventBus from '../eventbus';
import NoteForm from '../components/dashboard/notes/Form.vue';
import NoteCard from '../components/dashboard/notes/NoteCard.vue';
import EditNote from '@/components/dashboard/notes/EditNote.vue';
import DeleteModal from '@/components/DeleteModal.vue';

const API_URL = 'http://localhost:5000/';

export default {
  components: {
    NoteForm,
    NoteCard,
    EditNote,
    DeleteModal,
  },
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
    EventBus.$on('notesUpdate', () => {
      this.showForm = false;
      this.getNotes();
    });
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
</style>
