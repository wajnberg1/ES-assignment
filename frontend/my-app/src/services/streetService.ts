import axios from 'axios';


const API_URL = 'http://localhost:5000/api/search'; // Backend URL

export const fetchStreets = async (searchQuery: string, searchType: number) => {
  const response = await axios.get(API_URL, {
    params: {
      searchQuery,
	  searchType
    }
  });
  return response.data;
};