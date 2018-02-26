import { FETCH_USER } from './lib/vuex/actionTypes';
import Router from 'vue-router';
import Vue from 'vue';
import store from './lib/vuex';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      component: require('./layout/AppShell').default,
      children: [
        {
          path: '/',
          name: 'home',
          component: require('./views/Home').default,
        },
        {
          path: '/login',
          name: 'login',
          component: require('./views/Login').default,
        },
        {
          path: '/register',
          name: 'register',
          component: require('./views/Register').default,
        },
        {
          path: '/diary/public',
          name: 'public-diary',
          component: require('./views/PublicDiary').default,
        },
      ],
    },
  ],
});

// Fetch user info before mounting the router.

router.beforeEach(async (to, from, next) => {
  try {
    // Try and fetch the current user, if not previously fetched before.
    if (!store.state.User.fetched) await store.dispatch(FETCH_USER);
  } catch (e) {}

  next();
});

export default router;
