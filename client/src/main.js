import Vue from 'vue';
import jQuery from 'jquery';
import 'bootswatch/dist/superhero/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

const $ = jQuery;
window.$ = $;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
