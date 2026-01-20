import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { District } from '../entities/District';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const districtRepository = AppDataSource.getRepository(District);
    const districts = await districtRepository.find();
    const districtNames = districts.map((d) => d.name);
    res.json(districtNames);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch districts' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'District name is required' });
    }

    const districtRepository = AppDataSource.getRepository(District);
    const existingDistrict = await districtRepository.findOne({
      where: { name: name.trim() },
    });

    if (existingDistrict) {
      return res.status(409).json({ error: 'District already exists' });
    }

    const district = districtRepository.create({ name: name.trim() });
    const savedDistrict = await districtRepository.save(district);
    res.status(201).json(savedDistrict.name);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create district' });
  }
});

export default router;
