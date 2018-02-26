<template>
  <section class="section">
    <h3 class="title">Login</h3>
    <h5 class="subtitle is-size-6">Not a member yet?
      <router-link to="/register">Register</router-link>
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
          <form @submit.prevent="handleLogin">

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
              <button class="button is-primary" type="submit">Login</button>
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
import { LOGIN, FETCH_USER } from '../lib/vuex/actionTypes';

export default {
  data: () => ({
    username: '',
    password: '',
    errors: [],
  }),

  methods: {
    ...mapActions({
      login: LOGIN,
      fetchUser: FETCH_USER,
    }),

    async handleLogin() {
      this.errors = [];

      // Log in and get token.
      try {
        await this.login({ username: this.username, password: this.password });
        await this.fetchUser();
      } catch (e) {
        this.errors.push('Invalid username/password.');
        return;
      }

      // Redirect back to home page.
      this.$router.push('/');
    },
  },

  beforeRouteEnter(to, from, next) {
    // Redirect back to home page if already logged in.
    if (store.getters.isLoggedIn) next('/');
    else next();
  },
};
</script>

