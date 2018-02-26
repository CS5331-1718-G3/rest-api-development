<template>
  <section class="section">
    <h3 class="title">Register</h3>
    <h5 class="subtitle is-size-6">Already have an account?
      <router-link to="/login">Login</router-link>
    </h5>
    <hr>
    <div class="columns">
      <div class="column is-half is-offset-one-quarter">

        <article class="message is-danger" v-if="this.errors.length">
          <div class="message-header">Error</div>
          <div class="message-body content">
            <p v-for="(error, index) in errors" :key="index">{{ error }}</p>
          </div>
        </article>

        <div class="box">
          <form @submit.prevent="handleSubmit">

            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input type="text" class="input" v-model="username">
              </div>
            </div>

            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input type="password" class="input" v-model="password">
              </div>
            </div>

            <div class="field">
              <label class="label">Full Name</label>
              <div class="control">
                <input type="text" class="input" v-model="fullname">
              </div>
            </div>

            <div class="field">
              <label class="label">Age</label>
              <div class="control">
                <input type="text" class="input" v-model="age">
              </div>
            </div>

            <div class="field">
              <button class="button is-primary" type="submit">Register</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex';
import router from 'vue-router';
import store from '../lib/vuex';
import { REGISTER } from '../lib/vuex/actionTypes';

export default {
  data: () => ({
    username: '',
    password: '',
    fullname: '',
    age: '',
    errors: [],
  }),

  methods: {
    ...mapActions({
      register: REGISTER,
    }),

    async handleSubmit() {
      this.errors = [];

      // Log in and get token.
      try {
        await this.register({ username: this.username, password: this.password, fullname: this.fullname, age: this.age });
      } catch (e) {
        this.errors.push(e.message);
        return;
      }

      // Redirect back to home page.
      this.$router.push('/login?register');
    },
  },

  beforeRouteEnter(to, from, next) {
    // Redirect back to home page if already logged in.
    if (store.getters.isLoggedIn) next('/');
    else next();
  },
};
</script>

