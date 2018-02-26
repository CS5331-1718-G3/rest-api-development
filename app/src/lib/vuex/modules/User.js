import { SET_USER, UNSET_USER } from '../mutationTypes';
import { deleteUserToken, getUserToken, setUserToken } from '../../../utils/session';

import { post } from '../../../utils/restClient';

const initialState = {
  user: null,
};

const getters = {
  user: state => state.user,
};

const mutations = {
  [SET_USER](state, user) {
    state.user = user;
  },

  [UNSET_USER](state) {
    state.user = null;
  },
};

const actions = {
  async fetchUser({ commit, state }) {
    const token = getUserToken();

    // Fail if there is no token.
    if (!token) {
      commit(UNSET_USER);
      return null;
    }

    // Retrieve user information.
    let user;

    try {
      ({ status: _, ...user } = await post('/users', { token }));
      commit(SET_USER, user);
    } catch (e) {
      return null;
    }

    return user;
  },

  async login({ commit, state }, username, password) {
    try {
      const token = await post('/users/authenticate', { username, password }).token;
      setUserToken(token);
    } catch (e) {
      deleteUserToken();
    }
  },

  async logout({ commit, state }) {
    const token = getUserToken();

    // Just unset the Vuex state if there is no token.
    if (!token) {
      commit(UNSET_USER);
      return true;
    }

    try {
      // Even if there is no such token, log out anyway.
      await post('/users/expire', { token }).status;
      deleteUserToken();
      commit(UNSET_USER);
    } catch (e) {
      return false;
    }

    return true;
  },
};

export default {
  state: initialState,
  getters,
  mutations,
  actions,
};
