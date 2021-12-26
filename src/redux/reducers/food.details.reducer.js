import {foodDetailsConstant} from '../Action/constant';

const initState = {
  loading: false,
  message: '',
  data: [],
  error: '',
};

export const foodDetailsReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case foodDetailsConstant.GET_FOOD_DETAILS_SUCCESS:
      state = {
        ...state,
        data: payload.data,
      };
      break;
    case foodDetailsConstant.GET_FOOD_DETAILS_FAILED:
      state = {
        ...state,
        error: payload.error,
      };
  }
  return state;
};
