import Vue from 'vue';
import Router from 'vue-router';
import Store from './store';
import Home from './views/Home.vue';
import Signup from './views/Signup.vue';
import Login from './views/Login.vue';
import Notes from './views/Notes.vue';
import Dashboard from './views/Dashboard.vue';

Vue.use(Router);


function isloggedIn() {
  const API_URL = 'http://localhost:5000/';
  if (!localStorage.token) {
    Store.commit('setLoggedIn', false);
    Store.commit('setUser', {});
    return new Promise((resolve) => { resolve(false); });
  }
  return fetch(API_URL, {
    headers: {
      authorization: `Bearer ${localStorage.token}`,
    },
  }).then(res => res.json())
    .then((result) => {
      if (result.user) {
        Store.commit('setLoggedIn', true);
        Store.commit('setUser', result.user);
        return true;
      }
        localStorage.removeItem(token);
        Store.commit('setLoggedIn', false);
        Store.commit('setUser', {});
        return false;
    });
}
function loggedinRedirect(to, from, next) {
  isloggedIn().then((auth) => {
    if (auth) {
      next('/dashboard');
    } else {
      next();
    }
  })
}

function loggedOutRedirect(to, from, next) {
  isloggedIn().then((auth) => {
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
