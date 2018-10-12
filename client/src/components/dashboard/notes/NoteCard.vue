<template>
  <div
    class="card border-primary mb-3">
    <div class="card-header">
      <div class="row">
        <h4 class="col-10">{{note.title}}</h4>
        <div class="col-1 dropdown btn-group" role="group">
          <button
            id="noteOptions"
            type="button"
            class="btn btn-outline-primary dropdown-toggle card-btn-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">
          </button>
          <div
            class="dropdown-menu"
            aria-labelledby="noteOptions"
            x-placement="bottom-start"
            style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);">
            <button
              @click="registerEvent()"
              type="button"
              class="dropdown-item"
              data-toggle="modal"
              data-target="#editNoteModal">
              Edit Note
            </button>
            <button
              @click="registerEvent()"
              type="button"
              class="dropdown-item"
              data-toggle="modal"
              data-target="#deleteModal">
              Delete Note
            </button>
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
</template>

<script>
import markDown from 'markdown-it';
import mdEmoji from 'markdown-it-emoji';
import EventBus from '../../../eventbus';

const md = new markDown();
md.use(mdEmoji);

const API_URL = 'http://localhost:5000/';

export default {
  props: {
    note: {
      type: Object,
      required: true,
    },
  },
  methods: {
    renderMarkDown(note) {
      return md.render(note);
    },
    readableTime(time){
      const d = new Date(time);
      return d.toLocaleString();
    },
    registerEvent(){
      EventBus.$emit('launchDelete', this.note._id);
      EventBus.$once(this.note._id, (del) =>{
        if(del) {
          this.deleteNote();
        } else {
        }
      });
    },
    deleteNote(){
      const note = this.note;
      const data = {
        action: 'delete',
        note: note,
      };
      fetch(`${API_URL}api/v1/notes/manage`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then(res => res.json())
        .then((note) => {
          EventBus.$emit('notesUpdate');
        });
    }
  },
};
</script>

<style>

</style>
