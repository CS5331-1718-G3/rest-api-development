import App from './App';
import Vue from 'vue';
import libCookie from './lib/cookie';
import libFontawesome from './lib/fontawesome';
import router from './routes';
import store from './lib/vuex';

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
