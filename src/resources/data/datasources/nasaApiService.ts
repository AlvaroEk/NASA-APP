import axios from 'axios';
import { NASA_API_KEY } from '@env';

export const NasaApiService = {
  getApod: () =>
    axios.get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`),

  getApodList: (count: number) =>
    axios.get(`https://api.nasa.gov/planetary/apod?count=${count}&api_key=${NASA_API_KEY}`),

  getNeoFeed: (start: string, end: string) =>
    axios.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${NASA_API_KEY}`),

  searchTech: (query: string) => {
    const url = `https://api.nasa.gov/techtransfer/software/?engine&api_key=${NASA_API_KEY}`;
    return axios.get(url);
  },
};
