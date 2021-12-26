import {foodCategoeryConstant} from '../Action/constant';

const initState = {
  loading: false,
  message: '',
  data: [],
  error: '',
};

export const foodCategoeryReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case foodCategoeryConstant.GET_FOOD_CATEGOERY_SUCCESS:
      state = {
        ...state,
        data: payload.foodCategories,
      };
      break;
    case foodCategoeryConstant.GET_FOOD_CATEGOERY_FAILED:
      state = {
        ...state,
        error: payload.error,
      };
  }
  return state;
};
