import { SET_USER_PROFILE, UNSET_USER_PROFILE } from '../mutationTypes';
import { deleteUserToken, getUserToken, setUserToken } from '../../../utils/session';

import { post } from '../../../utils/restClient';

const initialState = {
  profile: null,
};

const getters = {
  profile: state => state.profile,
  isLoggedIn: state => state.profile != null,
};

const mutations = {
  [SET_USER_PROFILE](state, user) {
    state.profile = user;
  },

  [UNSET_USER_PROFILE](state) {
    state.profile = null;
  },
};

const actions = {
  async fetchUser({ commit, state }) {
    const token = getUserToken();

    // Fail if there is no token.
    if (!token) {
      commit(UNSET_USER_PROFILE);
      throw new Error('Invalid user token.');
    }

    // Retrieve user information.
    try {
      const { status, ...user } = await post('/users', { token });
      commit(SET_USER_PROFILE, user);

      return user;
    } catch (e) {
      // Log out if the token is invalid.
      commit(UNSET_USER_PROFILE);
      throw e;
    }
  },

  async login({ commit, state, dispatch }, { username, password }) {
    let token;

    try {
      // Get and save token.
      // Don't fetch the new user profile automatically.
      token = (await post('/users/authenticate', { username, password })).token;
      setUserToken(token);
    } catch (e) {
      deleteUserToken();

      // Rethrow if login was unsuccessful.
      throw e;
    }

    return true;
  },

  async logout({ commit, state }) {
    const token = getUserToken();

    // Just unset the Vuex state if there is no token.
    if (!token) {
      commit(UNSET_USER_PROFILE);
      return true;
    }

    try {
      // Even if there is no such token, log out anyway.
      await post('/users/expire', { token }).status;
      deleteUserToken();
      commit(UNSET_USER_PROFILE);
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
