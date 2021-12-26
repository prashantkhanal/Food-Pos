import {LoginConstant} from '../Action/constant';

const intiState = {
  user: {
    name: '',
    email: '',
  },
  token: null,
  authenticating: false,
  authenticate: false,
  error: false,
};

export default (state = intiState, {type, payload}) => {
  switch (type) {
    case LoginConstant.LOGIN_REQUEST:
      state = {
        ...state,
        authenticating: true,
      };
      break;
    case LoginConstant.LOGIN_SUCCESS:
      state = {
        ...state,
        token: payload.accessToken,
        user: payload.userData,
        authenticate: true,
        authenticating: false,
      };
      break;
    case LoginConstant.LOGIN_FAILED:
      state = {
        ...state,
        error: payload.error,
        authenticating: false,
      };
      break;
  }
  return state;
};
