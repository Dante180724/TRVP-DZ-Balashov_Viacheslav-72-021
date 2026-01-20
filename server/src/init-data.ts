import { AppDataSource } from './data-source';
import { District } from './entities/District';

export async function initializeDefaultDistricts() {
  const districtRepository = AppDataSource.getRepository(District);
  const existingDistricts = await districtRepository.find();

  if (existingDistricts.length === 0) {
    const defaultDistricts = [
      'Центральный',
      'Северный',
      'Южный',
      'Восточный',
      'Западный',
    ];

    for (const districtName of defaultDistricts) {
      const district = districtRepository.create({ name: districtName });
      await districtRepository.save(district);
    }

    console.log('Default districts initialized');
  }
}
