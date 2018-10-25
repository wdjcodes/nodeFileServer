import Vue from 'vue';
import jQuery from 'jquery';
import 'lato-font';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import App from './App.vue';
import router from './router';
import store from './store';
import globals from './globals';

Vue.config.productionTip = false;

const $ = jQuery;
window.$ = $;

Vue.mixin(globals);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
