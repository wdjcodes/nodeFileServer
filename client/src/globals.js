import Store from './store';

var globals = {
  computed: {
    loggedIn: { 
      get () {
        return Store.state.loggedIn;
      },
      set (authenticated) {
        Store.commit('setLoggedIn', authenticated);
      },
    },
    user: { 
      get () {
        return Store.state.user;
      },
      set (user) {
        Store.commit('setUser', user);
      },
    },
  },
  methods: {
    isloggedIn() {
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
    },
    logOut(){
      localStorage.removeItem('token');
      Store.commit('setLoggedIn', false);
      Store.commit('setUser', {});
    },
  },
}

export default globals;