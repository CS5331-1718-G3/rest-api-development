import Router from 'vue-router';
import Vue from 'vue';

Vue.use(Router);

export default new Router({
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
      ],
    },
  ],
});
