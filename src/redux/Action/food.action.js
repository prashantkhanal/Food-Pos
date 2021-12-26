import axios from '../../config';
import {foodConstant} from './constant';

export const foodAction = id => {
  return async dispatch => {
    let response;
    try {
      response = await axios.get(`/food_pos/${id}`);
      const {data} = response.data;

      dispatch({
        type: foodConstant.GET_FOOD_SUCCESS,
        payload: {
          data,
        },
      });
    } catch (error) {
      dispatch({
        type: foodConstant.GET_FOOD_FAILED,
        payload: {
          error: 'Something went wrong!! Please try again later',
        },
      });
    }
  };
};
