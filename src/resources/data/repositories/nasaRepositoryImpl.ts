// Importamos la interfaz que este repositorio debe implementar (contrato)
import { NasaRepository } from '../../domain/repositories/NasaRepository.interface';

// Servicio que contiene las funciones que llaman directamente a la API de la NASA
import { NasaApiService } from '../datasources/nasaApiService';

// Modelos de dominio (fuertemente tipados)
import { Apod } from '../../domain/models/Apod';
import { Neo } from '../../domain/models/Neo';
import { TechTransfer } from '../../domain/models/Tech';

// Implementación concreta del repositorio NASA
// Devuelve un objeto que cumple con la interfaz NasaRepository
export const NasaRepositoryImpl = (): NasaRepository => ({
  
  // 🔭 Método que obtiene la imagen del día (APOD)
  async fetchApod(): Promise<Apod> {
    const res = await NasaApiService.getApod(); // llamada al servicio
    return res.data; // retornamos el objeto ya parseado
  },

  // 🔁 Método que obtiene múltiples imágenes APOD aleatorias
  async fetchMultipleApods(count: number): Promise<Apod[]> {
    const res = await NasaApiService.getApodList(count);
    return res.data;
  },

  // ☄️ Método que obtiene la lista de asteroides cercanos entre dos fechas
  async fetchNeos(start: string, end: string): Promise<Neo[]> {
    const res = await NasaApiService.getNeoFeed(start, end);
    const rawData = res.data.near_earth_objects; // Objeto con fechas como claves

    const list: Neo[] = [];

    // Procesamos cada fecha y cada objeto de asteroide dentro de ella
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

  // 🛠️ Método que realiza una búsqueda de software en TechTransfer
  async searchTech(query: string): Promise<TechTransfer[]> {
    const res = await NasaApiService.searchTech(query);

    // Filtramos los resultados que contienen el texto de búsqueda en título o descripción
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
