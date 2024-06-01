import store from 'store';
import { REGISTER_USER_INFO, LOG_OUT, LOGIN_USER_INFO } from './action-type';

const initialState = store.get('user_key') || {};

export default (state = initialState, { type, data }) => {
  switch (type) {
    case LOGIN_USER_INFO:
      return data;
    case REGISTER_USER_INFO:
      // During registration, don't retain any user data
      return {};
    case LOG_OUT:
      return {};
    default:
      return state;
  }
};
