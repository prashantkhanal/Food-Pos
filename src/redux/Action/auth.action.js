import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../config';
import {LoginConstant} from './constant';

export const loginAction = uservalue => {
  return async dispatch => {
    dispatch({
      type: LoginConstant.LOGIN_REQUEST,
    });
    try {
      let data = await axios.post('/login', uservalue);

      const mainData = await data.data.data;
      const accessToken = mainData.access_token;
      const userData = JSON.stringify(mainData.user);
      await AsyncStorage.setItem('accessToken', accessToken);
      dispatch({
        type: LoginConstant.LOGIN_SUCCESS,
        payload: {
          userData,
          accessToken,
        },
      });
    } catch (error) {}
  };
};

export const isUserLogin = () => {
  return async dispatch => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      const data = await AsyncStorage.getItem('userData');
      dispatch({
        type: LoginConstant.LOGIN_SUCCESS,
        payload: {
          data,
          accessToken,
        },
      });
    }
  };
};
