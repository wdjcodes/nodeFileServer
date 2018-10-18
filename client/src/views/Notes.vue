<template>
  <section>
    <h1>Dashboard</h1>
    <h1>Hello, {{user.username}}! 👋</h1>
    <button
      v-if="!showForm"
      @click="showForm = !showForm"
      class="btn btn-primary">
      Add Note
    </button>
    <button
      v-if="showForm"
      @click="showForm = !showForm"
      class="btn btn-secondary">
      Cancel
    </button>
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
import EventBus from '@/eventbus';
import NoteForm from '@/components/notes/Form.vue';
import NoteCard from '@/components/notes/NoteCard.vue';
import EditNote from '@/components/notes/EditNote.vue';
import DeleteModal from '@/components/DeleteModal.vue';

export default {
  name: 'notes',
  components: {
    NoteForm,
    NoteCard,
    EditNote,
    DeleteModal,
  },
  data: () => ({
    newNote: {
      title: '',
      note: '',
    },
    showForm: false,
    notes: [],
  }),
  created() {
    EventBus.$on('notesUpdate', () => {
      this.showForm = false;
      this.getNotes();
    });
  },
  mounted() {
    this.getNotes();
  },
  methods: {
    getNotes() {
      fetch(`${this.API_URL}api/v1/notes`, {
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res => res.json()))
        .then((notes) => {
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
