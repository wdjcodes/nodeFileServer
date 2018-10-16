import Vue from 'vue';
import Router from 'vue-router';
import Globals from './globals';
import Home from './views/Home.vue';
import Signup from './views/Signup.vue';
import Login from './views/Login.vue';
import Notes from './views/Notes.vue';
import Dashboard from './views/Dashboard.vue';
import Authenticate from './views/Authenticate.vue';

Vue.use(Router);

function loggedinRedirect(to, from, next) {
  if (from.matched.some(path => path.meta.authenticated)) {
    if (Globals.computed.loggedIn.get()) {
      next('/dashboard');
    } else {
      next();
    }
  } else {
    Globals.computed.finalTarget.set(to);
    next('/auth');
  }
}

function loggedOutRedirect(to, from, next) {
  if (from.matched.some(path => path.meta.authenticated)) {
    if (Globals.computed.loggedIn.get()) {
      next();
    } else {
      next('/login');
    }
  } else {
    Globals.computed.finalTarget.set(to);
    next('/auth');
  }
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
      meta: { authenticated: true },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: loggedinRedirect,
      meta: { authenticated: true },
    },
    {
      path: '/auth',
      name: '/auth',
      component: Authenticate,
      meta: { authenticated: true },
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
