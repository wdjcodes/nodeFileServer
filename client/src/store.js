import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    loggedIn: false,
    user: {},
    finalTarget: null,
  },
  mutations: {
    setLoggedIn(state, authenticated) {
      state.loggedIn = authenticated;
    },
    setUser(state, user) {
      state.user = user;
    },
    setFinalTarget(state, to) {
      state.finalTarget = to;
    },
  },
  // actions: {
  //   setLoggedIn(state){
  //     console.log('setLoggedIn');
  //   }
  // }
});

export default store;
