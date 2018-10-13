import store from './store';

var globals = {
  computed: {
    loggedIn: { 
      get () {
        return store.state.loggedIn;
      },
      set (authenticated) {
        store.commit('setLoggedIn', authenticated);
      },
    },
    user: { 
      get () {
        return store.state.user;
      },
      set (user) {
        store.commit('setUser', user);
      },
    },
    // loggedIn: function() {
    //   return true;
    // },
    // user: function() {
    //   return {};
    // },
  },
}

export default globals;