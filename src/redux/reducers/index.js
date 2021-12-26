import {combineReducers} from 'redux';
import {foodCategoeryReducer} from './food-categoery.reducer';
import {foodReducer} from './food.reducers';
import {foodDetailsReducer} from './food.details.reducer';
import {cartReducer} from './cart.reducer';
import authReducers from './auth.reducers';

export const rootReducer = combineReducers({
  foodData: foodReducer,
  foodCategoery: foodCategoeryReducer,
  foodDetail: foodDetailsReducer,
  cartReducer: cartReducer,
  auth: authReducers,
});
