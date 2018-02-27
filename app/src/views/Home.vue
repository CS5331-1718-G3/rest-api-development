<template>
  <section class="section">
    <h3 class="title is-h3">Secret Diary</h3>
    <h5 class="subtitle is-h5">CS5331 Assignment 1</h5>
    <hr>

    <div class="content" v-if="isLoggedIn">
      <h4>Welcome back, {{ user.username }}.</h4>
      <ul>
        <li>
          <strong>Full Name:</strong> {{ user.fullname }}</li>
        <li>
          <strong>Age:</strong> {{ user.age }}</li>
      </ul>
      <hr>
    </div>

    <div class="content">
      <h4>REST API Status</h4>
      <div class="tags has-addons">
        <div class="tag is-dark">Status</div>
        <div class="tag is-success" v-if="status">Up</div>
        <div class="tag is-danger" v-else>Down</div>
      </div>
    </div>

    <hr>

    <article class="message is-danger" v-if="this.errors.length">
      <div class="message-header">Error</div>
      <div class="message-body content">
        <p v-for="(error, index) in errors" :key="index">{{ error }}</p>
      </div>
    </article>
    <div class="content" v-else>
      <h4>Group 3:</h4>
      <ul>
        <li v-for="name in members" :key="name">{{ name }}</li>
      </ul>
    </div>
  </section>
</template>

<script>
import { get, getStatus } from '../utils/restClient';
import { mapGetters, mapState } from 'vuex';
import { IS_LOGGED_IN } from '../lib/vuex/getterTypes';

export default {
  data() {
    return {
      status: false,
      members: [],
      errors: [],
    };
  },

  computed: {
    ...mapGetters({ isLoggedIn: IS_LOGGED_IN }),
    ...mapState({ user: state => state.User.profile }),
  },

  async created() {
    try {
      this.status = await getStatus('/meta/heartbeat');
    } catch (e) {
      this.status = false;
    }

    try {
      this.members = await get('/meta/members');
    } catch (e) {
      this.errors.push(e.message);
    }
  },
};
</script>
