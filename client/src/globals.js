import Store from './store';

const API_URL = 'http://localhost:5000/';
const SIGNUP_URL = `${API_URL}auth/signup`;
const LOGIN_URL = `${API_URL}auth/login`;

const globals = {
  data() {
    return {
      TRANSITION_DELAY: 300,
    };
  },
  computed: {
    loggedIn: {
      get() {
        return Store.state.loggedIn;
      },
    },
    user: {
      get() {
        return Store.state.user;
      },
      set(user) {
        Store.commit('setUser', user);
      },
    },
    finalTarget: {
      get() {
        return Store.state.finalTarget;
      },
      set(to) {
        if (to === {}) {
          Store.commit('setFinalTarget', null);
        } else {
          Store.commit('setFinalTarget', to);
        }
      },
    },
  },
  methods: {
    isLoggedIn() {
      if (!localStorage.token) {
        Store.commit('setLoggedIn', false);
        Store.commit('setUser', {});
        return new Promise((resolve) => {
          resolve(false);
        });
      }
      return fetch(API_URL, {
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      })
        .then(res => res.json())
        .then((result) => {
          if (result.user) {
            Store.commit('setLoggedIn', true);
            Store.commit('setUser', result.user);
            return true;
          }
          localStorage.removeItem('token');
          Store.commit('setLoggedIn', false);
          Store.commit('setUser', {});
          return false;
        });
    },
    signUp(username, password) {
      const body = {
        username,
        password,
      };
      this.waiting = true;
      return fetch(SIGNUP_URL, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
        },
      }).then((resp) => {
        if (resp.ok) {
          return resp.json().then((result) => {
            localStorage.token = result.token;
            Store.commit('setLoggedIn', true);
            Store.commit('setUser', result.user);
          });
        }
        return resp.json().then((error) => {
          localStorage.removeItem('token');
          Store.commit('setLoggedIn', false);
          Store.commit('setUser', {});
          throw new Error(error.message);
        });
      });
    },
    logIn(username, password) {
      const body = {
        username,
        password,
      };
      return fetch(LOGIN_URL, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
        },
      }).then((resp) => {
        if (resp.ok) {
          return resp.json().then((result) => {
            localStorage.token = result.token;
            Store.commit('setLoggedIn', true);
            Store.commit('setUser', result.user);
          });
        }
        return resp.json().then((error) => {
          localStorage.removeItem('token');
          Store.commit('setLoggedIn', false);
          Store.commit('setUser', {});
          throw new Error(error.message);
        });
      });
    },
    logOut() {
      localStorage.removeItem('token');
      Store.commit('setLoggedIn', false);
      Store.commit('setUser', {});
    },
  },
};

export default globals;
