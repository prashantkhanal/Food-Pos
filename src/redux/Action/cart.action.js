import {
  addCartConstant,
  clearAllCartConstant,
  clearCartConstant,
  decreaseCartConstant,
  increaseCartConstant,
  totalCartConstant,
} from './constant';

export const addToCart = data => {
  return dispatch => {
    dispatch({
      type: addCartConstant,
      payload: {
        data,
      },
    });
  };
};

export const getCartTotal = () => {
  return dispatch => {
    dispatch({
      type: totalCartConstant,
    });
  };
};

export const increaseAction = id => {
  return dispatch => {
    dispatch({
      type: increaseCartConstant,
      payload: {
        id,
      },
    });
  };
};
//  ({
//   type: increaseCartConstant,
//   payload: id,
// });

export const decreaseAction = id => {
  return dispatch => {
    dispatch({
      type: decreaseCartConstant,
      payload: {
        id,
      },
    });
  };
};

export const clearItemsAction = id => {
  return dispatch => {
    dispatch({
      type: clearCartConstant,
      payload: {
        id,
      },
    });
  };
};

export const clearAllItemsCartAction = () => {
  return dispatch => {
    dispatch({
      type: clearAllCartConstant,
    });
  };
};
//   type: addCardConstant,
//   paylaod: id,
