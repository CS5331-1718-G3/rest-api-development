<template>
  <section class="section">
    <h3 class="title">Create Diary Entry</h3>
    <h5 class="subtitle is-size-6">What's on your mind?</h5>
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
              <label class="label">Title</label>
              <div class="control">
                <input type="text" class="input" v-model="title">
              </div>
            </div>

            <div class="field">
              <label class="label">Content</label>
              <div class="control">
                <textarea class="textarea" rows="6" v-model="text"></textarea>
              </div>
            </div>

            <div class="field">
              <label class="label">Post Visibility</label>
              <label class="checkbox">
                <input type="checkbox" v-model="isPrivate"> Private
              </label>
            </div>

            <div class="field">
              <button class="button is-primary" type="submit">Save</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { post } from '../utils/restClient';
import { getUserToken } from '../utils/session';
import router from 'vue-router';
import store from '../lib/vuex';

export default {
  data: () => ({
    title: '',
    text: '',
    isPrivate: true,
    errors: [],
  }),

  methods: {
    async handleSubmit() {
      this.errors = [];

      try {
        await post('/diary/create', { token: getUserToken(), title: this.title, text: this.text, public: !this.isPrivate });
      } catch (e) {
        this.errors.push(e.message);
        return;
      }

      // Redirect back to home page.
      this.$router.push('/diary/personal?saved');
    },
  },

  beforeRouteEnter(to, from, next) {
    // Redirect back to home page if not logged in.
    if (!store.getters.isLoggedIn) next('/');
    else next();
  },
};
</script>

