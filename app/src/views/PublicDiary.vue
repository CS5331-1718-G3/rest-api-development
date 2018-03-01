<template>
  <section class="section">
    <h3 class="title is-h3">Public Diary Entries</h3>
    <h5 class="subtitle is-h5">View other users' diary entries that are public here.</h5>
    <hr>

    <div class="columns">
      <div class="column is-8 is-offset-2">

        <article class="message is-danger" v-if="this.errors.length">
          <div class="message-header">Error</div>
          <div class="message-body content">
            <p v-for="(error, index) in errors" :key="index">{{ error }}</p>
          </div>
        </article>

        <div class="card diary-entry" v-for="entry in entries" :key="entry.id">
          <header class="card-header">
            <p class="card-header-title">
              {{ entry.title }}
            </p>
          </header>
          <div class="card-content">
            <div class="content">
              {{ entry.text }}
              <br>
              <span class="is-size-7">
                {{ entry.author }} &middot;
                <time :datetime="entry.publish_date">
                  {{ formatAsRelative(entry.publish_date) }}
                </time>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { get } from '../utils/restClient';
import moment from 'moment';

export default {
  data: () => ({
    entries: [],
    errors: [],
  }),

  async mounted() {
    try {
      this.entries = await get('/diary');
    } catch (e) {
      this.errors.push(e.message);
    }
  },

  methods: {
    formatAsRelative(timestring) {
      return moment(timestring).fromNow();
    },
  },
};
</script>

<style lang="scss">
.diary-entry {
  margin-bottom: 20px;
}
</style>

