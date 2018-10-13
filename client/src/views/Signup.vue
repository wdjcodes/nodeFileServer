<template>
    <div>
        <h1>Sign Up</h1>
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
        <form v-if="!waiting" @submit.prevent="signup">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input
                        v-model="newUser.username"
                        class="form-control"
                        id="username"
                        aria-describedby="usernameHelp"
                        placeholder="Enter a username"
                        type="text" required>
                    <small id="usernameHelp" class="form-text text-muted">
                        Username must be at least 2 characters long <br>
                        Usernames can only include letters, numbers and -._</small>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-6">
                    <label for="password">Password</label>
                    <input
                        v-model="newUser.password"
                        class="form-control"
                        id="password"
                        aria-describedby="passwordHelp"
                        placeholder="Password"
                        type="password" required>
                    <small id="passwordHelp" class="form-text text-muted">
                        Passwords must be at least 8 characters long <br>
                        Passwords must include upper and lowercase letters,
                         numbers, and special characters. <br>
                        Valid special characters: !#@$%&?*</small>
                    </div>
                    <div class="form-group col-md-6">
                        <label for="confirmPassword">Confirm Password</label>
                        <input
                            v-model="newUser.confirmPassword"
                            class="form-control"
                            id="confirmPassword"
                            aria-describedby="confirmPasswordHelp"
                            placeholder="Password"
                            type="password" required>
                            <small id="confirmPasswordHelp" class="form-text text-muted">
                            Please re-enter your password</small>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary">Signup</button>
        </form>
    </div>
</template>

<script>
const Joi = require('joi');

const SIGNUP_URL = 'http://localhost:5000/auth/signup';

const schema = Joi.object().keys({
  username: Joi.string().regex(/^[a-zA-Z0-9_.-]*$/).min(2).max(30)
    .required(),
  password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#@$%&?*])[a-zA-Z0-9!#@$%&?*]{8,30}$/).required(),
  confirmPassword: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#@$%&?*])[a-zA-Z0-9!#@$%&?*]{8,30}$/).required(),
});
const JoiOptions = {
  abortEarly: false,
};

export default {
  data: () => ({
    newUser: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    waiting: false,
    errorMessage: '',
  }),
  watch: {
    newUser: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  methods: {
    signup() {
      this.errorMessage = '';
      if (this.validUser()) {
        const body = {
          username: this.newUser.username,
          password: this.newUser.password,
        };
        this.waiting = true;
        fetch(SIGNUP_URL, {
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
      if (this.newUser.password !== this.newUser.confirmPassword) {
        this.errorMessage = 'Passwords must match 🙈';
        return false;
      }
      const result = Joi.validate(this.newUser, schema, JoiOptions);
      if (result.error === null) {
        return true;
      }
      result.error.details.forEach((element) => {
        const key = element.path[0];
        if (key === 'username') {
          this.errorMessage += '🙊 Invalid Username 🙊 ';
        }
        if (key === 'password') {
          this.errorMessage += '🙈 Invalid Password 🙈 ';
        }
      });
      return false;
    },
  },
};
</script>

<style>
</style>
