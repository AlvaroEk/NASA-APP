// Importamos los modelos del dominio que serán retornados por el repositorio
import { Apod } from '../models/Apod';
import { Neo } from '../models/Neo';
import { TechTransfer } from '../models/Tech';

// Definimos la interfaz que actúa como contrato para cualquier implementación de un repositorio NASA
// Esta interfaz abstrae el acceso a los datos externos (API, base de datos, almacenamiento local, etc.)
export interface NasaRepository {
  // Obtiene la imagen del día (APOD) desde la NASA
  fetchApod(): Promise<Apod>;

  // Obtiene una lista de asteroides cercanos entre dos fechas
  fetchNeos(start: string, end: string): Promise<Neo[]>;

  // Realiza una búsqueda de software disponible en TechTransfer
  searchTech(query: string): Promise<TechTransfer[]>;

  // Obtiene múltiples imágenes APOD (cantidad definida por el parámetro)
  fetchMultipleApods(count: number): Promise<Apod[]>;
}
