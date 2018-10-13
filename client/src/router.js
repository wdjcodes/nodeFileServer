import Vue from 'vue';
import Router from 'vue-router';
import Globals from './globals';
import Home from './views/Home.vue';
import Signup from './views/Signup.vue';
import Login from './views/Login.vue';
import Notes from './views/Notes.vue';
import Dashboard from './views/Dashboard.vue';

Vue.use(Router);

function loggedinRedirect(to, from, next) {
  Globals.methods.isloggedIn().then((auth) => {
    if (auth) {
      next('/dashboard');
    } else {
      next();
    }
  })
}

function loggedOutRedirect(to, from, next) {
  Globals.methods.isloggedIn().then((auth) => {
    if (auth) {
        next();
      } else {
        next('/login');
      }
    })
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      beforeEnter: loggedinRedirect,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: loggedinRedirect,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: loggedOutRedirect,
    },
    {
      path: '/notes',
      name: 'notes',
      component: Notes,
      beforeEnter: loggedOutRedirect,
    },
  ],
});
