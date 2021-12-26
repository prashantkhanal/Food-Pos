import {
  addCartConstant,
  clearAllCartConstant,
  clearCartConstant,
  decreaseCartConstant,
  increaseCartConstant,
} from '../Action/constant';

const initState = {
  totalAmount: 0,
  totalCount: 0,
  cart: [],
};
export const cartReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case clearAllCartConstant:
      return {
        ...initState,
      };
    case addCartConstant:
      for (let i = 0; i < state.cart.length; i++) {
        if (state.cart[i].id === payload.data.id) {
          state.cart[i].count += 1;
          return {
            ...state,
            totalAmount: state.totalAmount + Number(payload.data.price),
          };
        }
      }
      return {
        ...state,
        totalAmount: state.totalAmount + Number(payload.data.price),

        cart: [
          ...state.cart,
          {
            ...payload.data,
            count: 1,
          },
        ],
      };

    case increaseCartConstant:
      let cart = [...state.cart];
      cart[payload.id].count = cart[payload.id].count + 1;
      let totalCost = state.totalAmount + Number(cart[payload.id].price);

      return {...initState, totalAmount: totalCost, cart};

    case decreaseCartConstant:
      let totalCost2 = state.totalAmount;
      cart = [...state.cart];
      if (cart[payload.id].count > 1) {
        cart[payload.id].count = cart[payload.id].count - 1;
        totalCost2 = state.totalAmount - Number(cart[payload.id].price);
      }
      return {...initState, cart, totalAmount: totalCost2};
    case clearCartConstant:
      return {
        ...state,
        totalAmount:
          state.totalAmount -
          Number(state.cart[payload.id].price) *
            Number(state.cart[payload.id].count),
        cart: state.cart.filter((item, index) => index !== payload.id),
      };
  }
  return state;
};
