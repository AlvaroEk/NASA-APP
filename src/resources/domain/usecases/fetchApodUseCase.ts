import { NasaRepository } from '../repositories/NasaRepository.interface';

export const fetchApodsUseCase = (repo: NasaRepository, count: number) => {
  return repo.fetchMultipleApods(count);
};
