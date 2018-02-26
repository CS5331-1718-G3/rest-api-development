<template>
  <div id="app-shell">
    <nav class="navbar is-dark">
      <div class="container">
        <div class="navbar-brand">
          <div class="navbar-item">
            Secret Diary
          </div>

          <div :class="{ 'navbar-burger': true, 'is-active': isMenuVisible }" @click.prevent="isMenuVisible = !isMenuVisible">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div :class="{ 'navbar-menu': true, 'is-active': isMenuVisible }">
          <div class="navbar-start">
            <template v-for="item in menu">
              <router-link :key="item.url" v-if="!item.submenu" class="navbar-item" :to="item.url" active-class="is-active">
                {{ item.label }}
              </router-link>

              <div v-else :key="item.url" class="navbar-item has-dropdown is-hoverable">

                <router-link v-if="item.url && item.url.length" class="navbar-link" :to="item.url" active-class="is-active">
                  {{ item.label }}
                </router-link>

                <div class="navbar-link" v-else>
                  {{ item.label }}
                </div>

                <div class="navbar-dropdown is-boxed">
                  <router-link v-for="subitem in item.items" :key="subitem.url" class="navbar-item is-hoverable" :to="subitem.url" active-class="is-active">
                    {{ subitem.label }}
                  </router-link>
                </div>
              </div>
            </template>
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <router-link class="button is-primary" to="/login" v-if="!isLoggedIn">
                <span class="icon">
                  <font-awesome-icon icon="sign-in-alt" />
                </span>
                <span>Login</span>
              </router-link>
              <a class="button is-warning" @click.prevent="logout" v-else>
                <span class="icon">
                  <font-awesome-icon icon="sign-out-alt" />
                </span>
                <span>Logout</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <section id="main">
      <div class="container">
        <router-view></router-view>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p class="is-size-7">
            Submission for CS5331: Web Security Assignment 1, AY 17/18 Semester 2.
            <br> &copy; CS5331 Group 3 (Alwinson Au-Yong, Irvin Lim, Joel Tan, Teng Yong Hao) 2018.
          </p>
          <p class="is-size-7">
            <a href="https://github.com/CS5331-1718-G3/rest-api-development" target="_blank">
              <font-awesome-icon :icon="['fab','github']" />
              <span>View on GitHub</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

export default {
  name: 'AppShell',

  data: () => ({
    menu: [
      {
        url: '/',
        label: 'Home',
      },
      {
        url: '/diary/public',
        label: 'Public Diary',
      },
      {
        submenu: true,
        label: 'Personal Diary',
        url: '',
        items: [
          {
            url: '/diary/personal',
            label: 'Diary Entries',
          },
          {
            url: '/diary/new',
            label: 'Create New',
          },
        ],
      },
    ],
    isMenuVisible: false,
  }),

  components: {
    FontAwesomeIcon,
  },

  computed: mapGetters(['isLoggedIn']),
  methods: mapActions(['logout']),
};
</script>

<style lang="scss">
#app-shell {
  height: 100%;
}

footer.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem 1.5rem;
}
</style>

