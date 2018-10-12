<template>
  <div
    class="modal fade"
    id="deleteModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalLabel">Delete Note</h5>
          <button
            @click="cancel()"
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <h6>{{deleteEvent}} Are you sure you want to delete this?</h6>
        </div>
        <div class="modal-footer">
          <button
            @click="deleteEntity()"
            type="button"
            class="btn btn-danger"
            data-dismiss="modal">
            Delete
          </button>
          <button
            @click="cancel()"
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '@/eventbus.js';

export default {
  data () {
    return {
      deleteEvent: '',
    };
  },
  methods: {
    deleteEntity(){
      console.log("Delete Event ", this.deleteEvent);
      EventBus.$emit(this.deleteEvent, true);
      EventBus.$once('launchDelete', (returnEvent) => {
        this.deleteEvent = returnEvent;
      });
    },
    cancel(){
      console.log("Cancel delete")
      EventBus.$emit(this.deleteEvent, false);
      EventBus.$once('launchDelete', (returnEvent) => {
        this.deleteEvent = returnEvent;
      });
    }
  },
  created () {
    EventBus.$once('launchDelete', (returnEvent) => {
      this.deleteEvent = returnEvent;
    });
  },
}
</script>

<style>

</style>
