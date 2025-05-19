import NASAService from "../../../api/NASAService";

export class NASARepository {
  async getAPODData() {
    console.log("Fetching APOD data from NASAService...");
    return await NASAService.getAPODData();
  }
}
