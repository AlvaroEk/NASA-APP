import { getAPODData } from "../resources/config/apiConfig";

const NASAService = {
  getAPODData: async () => {
    console.log("Fetching APOD data from NASAService...");
    try {
      const data = await getAPODData();
      console.log("APOD Data fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("Error fetching APOD data:", error);

      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

      return null;
    }
  },
};

export default NASAService;
