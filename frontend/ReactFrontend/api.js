// api.js
import axios from 'axios';

const BASE_URL = 'http://192.168.1.4:8080'; // Replace with your actual backend URL

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 5000, // Set a timeout value in milliseconds
  });
  

  export const getUsers = async () => {
    try {
      const response = await api.get('/usersall');    
      console.log('Response:', response.data.users);
      return response.data;
    } catch (error) {
      console.error('Error fetching users: Get', error);
      throw error;  
    }  
  };
  
  export const getAUser = async (id) => {
    try {
      console.log("ID is ",id);
      const response = await api.get(`/users/${id}`);
      console.log("ID data is  ",response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };

export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
