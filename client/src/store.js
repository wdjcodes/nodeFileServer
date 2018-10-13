import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    loggedIn: false,
    user: {},
  },
  mutations: {
    setLoggedIn(state, authenticated){
      state.loggedIn = authenticated;
    },
    setUser(state, user){
      state.user = user;
    },
  },
  // actions: {
  //   setLoggedIn(state){
  //     console.log('setLoggedIn');
  //   }
  // }
});

export default store;
