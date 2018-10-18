<template>
  <form @submit.prevent="addNote()">
    <div class="form-group">
      <label for="title">Title</label>
      <input
      v-model="newNote.title"
      type="text"
      class="form-control"
      id="title"
      aria-describedby="titleHelp"
      placeholder="Enter title" required>
      <small
        id="titlelHelp"
        class="form-text text-muted">
        Eneter a descriptive title for your note.
      </small>
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
</template>

<script>
import EventBus from '@/eventbus';

const API_URL = 'http://localhost:5000/';

export default {
  data: () => ({
    newNote: {
      title: '',
      note: '',
    },
  }),
  methods: {
    addNote() {
      fetch(`${API_URL}api/v1/notes`, {
        method: 'POST',
        body: JSON.stringify(this.newNote),
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then(res => res.json())
        .then(() => {
          this.newNote.title = '';
          this.newNote.note = '';
          EventBus.$emit('notesUpdate');
        });
    },
  },
};
</script>

<style>
</style>
