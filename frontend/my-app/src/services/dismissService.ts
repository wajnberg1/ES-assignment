import axios from 'axios';


const API_URL = 'http://localhost:5000/api/dismiss'; // Backend URL

export const dismissStreet = async (id: string) => {
  const response = await axios.post(API_URL, {
    id: id
  });
  return response;
};