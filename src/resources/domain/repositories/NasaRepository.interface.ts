import { Apod } from '../models/Apod';
import { Neo } from '../models/Neo';
import { TechTransfer } from '../models/Tech';

export interface NasaRepository {
  fetchApod(): Promise<Apod>;
  fetchNeos(start: string, end: string): Promise<Neo[]>;
  searchTech(query: string): Promise<TechTransfer[]>;
  fetchMultipleApods(count: number): Promise<Apod[]>;
}
