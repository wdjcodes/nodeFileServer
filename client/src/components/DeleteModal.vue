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
          <h6>Are you sure you want to delete this?</h6>
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
  props: {
    deleteEvent: {
      type: String,
      required: true,
    },
  },
  methods: {
    deleteEntity(){
      EventBus.$emit(this.deleteEvent, true);
    },
    cancel(){
      EventBus.$emit(this.deleteEvent, false);
    }
  }
}
</script>

<style>

</style>
