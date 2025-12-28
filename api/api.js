import axios from 'axios';
import { Platform } from 'react-native';  // ← Add this import
import AsyncStorage from '@react-native-async-storage/async-storage';



const BASE_URL = Platform.OS === 'android'
  ? 'http://172.18.6.130:3000/api'
  : 'http://localhost:3000/api';


const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Your async interceptor (keep this!)
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading token:', error);
    }
    return config;
  }
);

export default api;