// Cliente HTTP para realizar llamadas a la API
import axios from 'axios';

// Clave de la API NASA, importada desde variables de entorno (.env)
import { NASA_API_KEY } from '@env';

// Objeto que centraliza todas las llamadas a la API de la NASA
// Esta es la fuente externa de datos, usada por los repositorios
export const NasaApiService = {
  // 🔭 Llama a la API APOD para obtener la imagen del día
  getApod: () =>
    axios.get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`),

  // 🔁 Llama a la API APOD para obtener múltiples imágenes aleatorias
  getApodList: (count: number) =>
    axios.get(`https://api.nasa.gov/planetary/apod?count=${count}&api_key=${NASA_API_KEY}`),

  // ☄️ Llama a la API NEO para obtener asteroides entre dos fechas
  getNeoFeed: (start: string, end: string) =>
    axios.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${NASA_API_KEY}`),

  // 🚀 Llama a la API de TechTransfer para buscar software (actualmente estática con engine)
  searchTech: (query: string) => {
    const url = `https://api.nasa.gov/techtransfer/software/?engine&api_key=${NASA_API_KEY}`;
    return axios.get(url);
  },
};
