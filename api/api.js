import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const BASE_URL = Platform.OS === 'android'
//   ? 'http://10.0.2.2:3000/api'      // Android emulator
//   : 'http://192.168.1.125:3000/api'; // real phone & iOS simulator
const BASE_URL = 'http://192.168.1.121:3000/api';


console.log('API BASE_URL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;