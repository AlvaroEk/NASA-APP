import { NasaRepository } from '../repositories/NasaRepository.interface';
import { Apod } from '../models/Apod';

// Caso para obtener un solo APOD
export const fetchApodUseCase = async (repo: NasaRepository): Promise<Apod> => {
  return await repo.fetchApod();
};

// Caso para obtener múltiples APODs
export const fetchApodsUseCase = async (
  repo: NasaRepository,
  count: number
): Promise<Apod[]> => {
  return await repo.fetchMultipleApods(count);
};
