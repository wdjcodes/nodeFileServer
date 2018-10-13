import Vue from 'vue';
import jQuery from 'jquery';
import 'bootswatch/dist/superhero/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
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
