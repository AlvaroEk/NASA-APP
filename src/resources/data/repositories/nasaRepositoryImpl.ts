import { NasaRepository } from '../../domain/repositories/NasaRepository.interface';
import { NasaApiService } from '../datasources/nasaApiService';
import { Apod } from '../../domain/models/Apod';
import { Neo } from '../../domain/models/Neo';
import { TechTransfer } from '../../domain/models/Tech';

export const NasaRepositoryImpl = (): NasaRepository => ({
  async fetchApod(): Promise<Apod> {
    const res = await NasaApiService.getApod();
    return res.data;
  },

  async fetchMultipleApods(count: number): Promise<Apod[]> {
    const res = await NasaApiService.getApodList(count);
    return res.data;
  },

  async fetchNeos(start: string, end: string): Promise<Neo[]> {
    const res = await NasaApiService.getNeoFeed(start, end);
    const rawData = res.data.near_earth_objects;
    const list: Neo[] = [];

    Object.keys(rawData).forEach(date => {
      rawData[date].forEach((item: any) => {
        list.push({
          id: item.id,
          name: item.name,
          absolute_magnitude_h: item.absolute_magnitude_h,
          is_potentially_hazardous_asteroid: item.is_potentially_hazardous_asteroid,
          estimated_diameter_km_min: item.estimated_diameter.kilometers.estimated_diameter_min,
          estimated_diameter_km_max: item.estimated_diameter.kilometers.estimated_diameter_max,
          velocity_kmh: item.close_approach_data[0].relative_velocity.kilometers_per_hour,
          miss_distance_km: item.close_approach_data[0].miss_distance.kilometers,
          close_approach_date: item.close_approach_data[0].close_approach_date,
        });
      });
    });

    return list;
  },

  async searchTech(query: string): Promise<TechTransfer[]> {
    const res = await NasaApiService.searchTech(query);
    return (res.data.results || []).filter((item: any[]) =>
      item[2]?.toLowerCase().includes(query.toLowerCase()) ||
      item[3]?.toLowerCase().includes(query.toLowerCase())
    ).map((item: any[]) => ({
      id: item[0],
      title: item[2],
      description: item[3],
    }));
  }
});
