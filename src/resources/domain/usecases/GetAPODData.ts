import { NASARepository } from '../../data/repositories/NASARepository';

export class GetAPODData {
  constructor(private nasaRepository: NASARepository) {}

  async execute() {
    return await this.nasaRepository.getAPODData();
  }
}
