// src/client/src/services/api.js
// version 1.01

import axios from 'axios';

const API_BASE_URL = '/api/admin'; // Adjust this if your API is hosted elsewhere

export const uploadData = async (dataType, formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/upload-${dataType}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'An error occurred while uploading data');
  }
};