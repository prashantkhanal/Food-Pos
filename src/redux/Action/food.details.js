import axios from '../../config';
import {foodDetailsConstant} from './constant';

export const foodDetailsAction = id => {
  return async dispatch => {
    let response;
    try {
      response = await axios.get(`/food/${id}`);
      const data = response.data;
      dispatch({
        type: foodDetailsConstant.GET_FOOD_DETAILS_SUCCESS,
        payload: {
          data,
        },
      });
    } catch (error) {
      dispatch({
        type: foodDetailsConstant.GET_FOOD_DETAILS_FAILED,
        payload: {
          error: 'Something went wrong!! Please try again later',
        },
      });
    }
  };
};
