<template>
  <section>
    <h1>Login</h1>
    <loading v-if="waiting"></loading>
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
          v-model="userInfo.username"
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
          v-model="userInfo.password"
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
import Joi from 'joi';
import Loading from '@/components/Loading.vue';

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
    userInfo: {
      username: '',
      password: '',
    },
    waiting: false,
  }),
  watch: {
    userInfo: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  components: {
    Loading,
  },
  methods: {
    login() {
      this.errorMessage = '';
      this.waiting = true;
      if (this.validUser()) {
        this.logIn(this.userInfo.username, this.userInfo.password)
        .then((result) => {
          setTimeout(() => {
            this.$router.push('/dashboard');
          }, this.TRANSITION_DELAY);
        })
        .catch((error) => {
          setTimeout(() => {
            this.waiting = false;
            this.errorMessage = error.message;
          }, this.TRANSITION_DELAY);
        });
      }
    },
    validUser() {
      const result = Joi.validate(this.userInfo, schema, JoiOptions);
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
  beforeRouteLeave (to, from, next){
    this.waiting = false;
    this.errorMessage = 'A critical client error has ocurred!';
    next();
  },
};
</script>

<style>
</style>
