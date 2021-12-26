import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL} from './baseUrl';

const getToken = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const parseToken = JSON.parse(token);
  return 'Bearer' + ' ' + parseToken;
};

const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvY2FudGVlbi50cmltdXJ0aXRlY2hub2xvZ3kuY29tXC9rXC9hcGlcL2F1dGhcL2xvZ2luIiwiaWF0IjoxNjM5NDU5NTI5LCJuYmYiOjE2Mzk0NTk1MjksImp0aSI6IktEV3ZvWldWeWMzVXh2S24iLCJzdWIiOjIwLCJwcnYiOiJmNjRkNDhhNmNlYzdiZGZhN2ZiZjg5OTQ1NGI0ODhiM2U0NjI1MjBhIn0.eh70NQUhSx12y9hyMC6n6qMufbaogc4xdmih5ejEbic';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    authorization: `Bearer ${token || getToken()}`,
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
