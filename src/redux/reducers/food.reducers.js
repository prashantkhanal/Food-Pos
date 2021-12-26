import {foodConstant} from '../Action/constant';

const initState = {
  loading: false,
  message: '',
  data: [],
  error: '',
};

export const foodReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case foodConstant.GET_FOOD_SUCCESS:
      state = {
        ...state,
        data: payload.data,
      };
      break;
    case foodConstant.GET_FOOD_FAILED:
      state = {
        ...state,
        error: payload.error,
      };
  }
  return state;
};
