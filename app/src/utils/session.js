import Vue from 'vue';

const COOKIE_NAMES = {
  token: 'userToken',
};

const COOKIE_EXPIRY_DAYS = 21;
const COOKIE_DOMAIN = 'localhost';

export const getUserToken = () => {
  const cookie = Vue.cookie.get(COOKIE_NAMES.token);
  return cookie;
};

export const setUserToken = token => {
  Vue.cookie.set(COOKIE_NAMES.token, token, { expires: COOKIE_EXPIRY_DAYS, domain: COOKIE_DOMAIN });
};

export const deleteUserToken = () => {
  Vue.cookie.delete(COOKIE_NAMES.token, { domain: COOKIE_DOMAIN });
};
