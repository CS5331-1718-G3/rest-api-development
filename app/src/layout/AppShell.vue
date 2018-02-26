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
            <a href="https://github.com/CS5331-1718-G3/rest-api-development" class="navbar-item">
              <span class="icon">
                <font-awesome-icon :icon="['fab','github']" />
              </span>
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </nav>

    <section id="main">
      <div class="container">
        <router-view></router-view>
      </div>
    </section>
  </div>
</template>

<script>
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
        submenu: true,
        label: 'Meta',
        url: '',
        items: [{ url: '/meta/members', label: 'Members' }],
      },
    ],
    isMenuVisible: false,
  }),

  components: {
    FontAwesomeIcon,
  },
};
</script>
