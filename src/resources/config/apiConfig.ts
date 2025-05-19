import axios from "axios";
import Constants from "expo-constants";

const NASA_API_KEY = Constants.expoConfig?.extra?.NASA_API_KEY;

const api = axios.create({
  baseURL: "https://api.nasa.gov",
  params: {
    api_key: NASA_API_KEY,
  },
});

export const getAPODData = async () => {
  try {
    const response = await api.get("/planetary/apod");
    return response.data;
  } catch (error) {
    console.error("Error fetching APOD data:", error);
    return null;
  }
};
