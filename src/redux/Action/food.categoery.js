import axios from '../../config';
import {foodCategoeryConstant} from './constant';

export const foodCategoeryAction = () => {
  return async dispatch => {
    let response;
    try {
      response = await axios.get('/food_categories');

      const {data} = response.data;
      const foodCategories = data;
      dispatch({
        type: foodCategoeryConstant.GET_FOOD_CATEGOERY_SUCCESS,
        payload: {
          foodCategories,
        },
      });
    } catch (error) {
      dispatch({
        type: foodCategoeryConstant.GET_FOOD_CATEGOERY_FAILED,
        payload: {
          error: 'Something went wrong!! Please try again later',
        },
      });
    }
  };
};
