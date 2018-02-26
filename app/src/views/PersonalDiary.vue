<template>
  <section class="section">
    <h3 class="title is-h3">Personal Diary Entries</h3>
    <h5 class="subtitle is-h5">View your own diary entries here.</h5>
    <hr>

    <div class="columns">
      <div class="column is-8 is-offset-2">

        <div class="notification is-success" v-if="successMessage && !isNotificationHidden">
          <button class="button delete" @click.prevent="isNotificationHidden = true"></button>
          {{ successMessage }}
        </div>

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
                </time> &middot; {{ entry.public ? 'Public' : 'Private' }}
              </span>
            </div>
          </div>
          <footer class="card-footer">
            <a href="#" class="card-footer-item" @click.prevent="handleDelete(entry.id)">Delete</a>
            <a href="#" class="card-footer-item" @click.prevent="handleTogglePermission(entry.id, !entry.public)">
              {{ entry.public ? 'Make Private' : 'Make Public' }}
            </a>
          </footer>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { post } from '../utils/restClient';
import moment from 'moment';
import { getUserToken } from '../utils/session';

export default {
  data: () => ({
    entries: [],
    errors: [],
    successMessage: null,
    isNotificationHidden: false,
  }),

  async mounted() {
    try {
      this.entries = (await post('/diary', { token: getUserToken() })).result;
    } catch (e) {
      this.errors.push(e.message);
    }
  },

  methods: {
    formatAsRelative(timestring) {
      return moment(timestring).fromNow();
    },

    async handleDelete(id) {
      this.errors = [];
      this.successMessage = null;

      try {
        await post('/diary/delete', { token: getUserToken(), id });
      } catch (e) {
        this.errors.push(e.message);
        return;
      }

      this.successMessage = 'Successfully deleted diary entry.';
    },

    async handleTogglePermission(id, isPublic) {
      this.errors = [];
      this.successMessage = null;

      try {
        await post('/diary/permission', { token: getUserToken(), id, public: isPublic });
      } catch (e) {
        this.errors.push(e.message);
        return;
      }

      this.successMessage = 'Successfully changed permissions of diary entry.';
    },
  },
};
</script>

<style lang="scss">
.diary-entry {
  margin-bottom: 20px;
}
</style>

