import { FETCH_USER, LOGIN, LOGOUT, REGISTER } from '../actionTypes';
import { SET_AS_FETCHED, SET_USER_PROFILE, UNSET_USER_PROFILE } from '../mutationTypes';
import { deleteUserToken, getUserToken, setUserToken } from '../../../utils/session';

import { IS_LOGGED_IN } from '../getterTypes';
import { post } from '../../../utils/restClient';

const initialState = {
  profile: null,
  fetched: false,
};

const getters = {
  [IS_LOGGED_IN]: state => state.profile != null,
};

const mutations = {
  [SET_USER_PROFILE](state, user) {
    state.profile = user;
  },

  [UNSET_USER_PROFILE](state) {
    state.profile = null;
  },

  [SET_AS_FETCHED](state) {
    state.fetched = true;
  },
};

const actions = {
  async [FETCH_USER]({ commit, state }) {
    const token = getUserToken();

    // Mark the state as fetched previously.
    commit(SET_AS_FETCHED);

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

  async [LOGIN]({ commit, state, dispatch }, data) {
    let token;

    try {
      // Get and save token.
      // Don't fetch the new user profile automatically.
      token = (await post('/users/authenticate', data)).token;
      setUserToken(token);
    } catch (e) {
      deleteUserToken();

      // Rethrow if login was unsuccessful.
      throw e;
    }

    return true;
  },

  async [LOGOUT]({ commit, state }) {
    const token = getUserToken();

    // Just unset the Vuex state if there is no token.
    if (!token) {
      commit(UNSET_USER_PROFILE);
      return true;
    }

    try {
      // Even if there is no such token, log out anyway.
      await post('/users/expire', { token });
      deleteUserToken();
      commit(UNSET_USER_PROFILE);
    } catch (e) {
      return false;
    }

    return true;
  },

  async [REGISTER]({ commit, state }, data) {
    try {
      await post('/users/register', data);
    } catch (e) {
      throw e;
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
