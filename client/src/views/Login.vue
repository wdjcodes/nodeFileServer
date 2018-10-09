<template>
  <section>
    <h1>Login</h1>
    <div v-if="waiting" class="row justify-content-center">
          <div class="col-4">
            <img src ="../assets/Infinity-Loading.svg">
          </div>
        </div>
    <div v-if="errorMessage" class="alert alert-dismissible alert-danger">
      <button
          type="button"
          class="close"
          data-dismiss="alert">&times;</button>
      <strong>Oh snap!</strong>
      {{errorMessage}}
    </div>
    <form v-if="!waiting" @submit.prevent="login">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          v-model="user.username"
          class="form-control"
          id="username"
          aria-describedby="usernameHelp"
          placeholder="Enter a username"
          type="text" required
        >
        <small id="usernameHelp" class="form-text text-muted">
          Enter a username to login.
        </small>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          v-model="user.password"
          class="form-control"
          id="password"
          aria-describedby="passwordHelp"
          placeholder="Password"
          type="password" required
        >
        <small id="passwordHelp" class="form-text text-muted">
          Enter your password to login.
        </small>
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </section>
</template>

<script>
const Joi = require('joi');

const LOGIN_URL = 'http://localhost:5000/auth/login';

const schema = Joi.object().keys({
  username: Joi.string().regex(/^[a-zA-Z0-9_.-]*$/).min(2).max(30)
    .required(),
  password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#@$%&?*])[a-zA-Z0-9!#@$%&?*]{8,30}$/).required(),
});

const JoiOptions = {
  abortEarly: false,
};

export default {
  data: () => ({
    errorMessage: '',
    user: {
      username: '',
      password: '',
    },
    waiting: false,
  }),
  watch: {
    user: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  methods: {
    login() {
      this.errorMessage = '';
      if (this.validUser()) {
        const body = {
          username: this.user.username,
          password: this.user.password,
        };
        this.waiting = true;
        fetch(LOGIN_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        })
          .then((resp) => {
            if (resp.ok) {
              return resp.json();
            }
            return resp.json().then((error) => {
            // console.log(error.message);
              throw new Error(error.message);
            });
          })
          .then((result) => {
            localStorage.token = result.token;
            setTimeout(() => {
              this.waiting = false;
              this.$router.push('/dashboard');
            }, 1000);
          })
          .catch((error) => {
            setTimeout(() => {
              this.waiting = false;
              this.errorMessage = error.message;
            }, 1000);
          });
      }
    },
    validUser() {
      const result = Joi.validate(this.user, schema, JoiOptions);
      if (result.error === null) {
        return true;
      }
      result.error.details.forEach((element) => {
        const key = element.path[0];
        if (key === 'username') {
          this.errorMessage += ' 🙊 Invalid Username 🙊 ';
        }
        if (key === 'password') {
          this.errorMessage += ' 🙈 Invalid Password 🙈 ';
        }
      });
      return false;
    },
  },
};
</script>

<style>

</style>
