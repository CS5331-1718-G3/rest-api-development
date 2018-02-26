<template>
  <div>
    <section class="section">
      <h3 class="title is-h3">Secret Diary</h3>
      <h5 class="subtitle is-h5">CS5331 Assignment 1</h5>
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
  </div>
</template>

<script>
import { get } from '../utils/restClient';

export default {
  data() {
    return {
      members: [],
      errors: [],
    };
  },

  async created() {
    try {
      this.members = await get('/meta/members');
    } catch (e) {
      this.errors.push(e.message);
    }
  },
};
</script>
