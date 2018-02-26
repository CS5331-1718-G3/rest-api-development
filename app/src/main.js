import App from './App';
import Vue from 'vue';
import libFontawesome from './lib/fontawesome';
import libToasted from './lib/toasted';
import router from './routes';

new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
