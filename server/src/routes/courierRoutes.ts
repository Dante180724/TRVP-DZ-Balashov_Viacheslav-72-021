import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Courier } from '../entities/Courier';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const courierRepository = AppDataSource.getRepository(Courier);
    const couriers = await courierRepository.find({
      relations: ['tasks'],
    });
    res.json(couriers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch couriers' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const courierRepository = AppDataSource.getRepository(Courier);
    const courier = await courierRepository.findOne({
      where: { id: req.params.id },
      relations: ['tasks'],
    });
    if (!courier) {
      return res.status(404).json({ error: 'Courier not found' });
    }
    res.json(courier);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courier' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { fullName, workDistrict, maxCells = 10 } = req.body;
    if (!fullName || !workDistrict) {
      return res.status(400).json({ error: 'Full name and work district are required' });
    }

    const courierRepository = AppDataSource.getRepository(Courier);
    const courier = courierRepository.create({
      id: uuidv4(),
      fullName,
      workDistrict,
      maxCells: maxCells || 10,
    });
    const savedCourier = await courierRepository.save(courier);
    res.status(201).json(savedCourier);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create courier' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { fullName, workDistrict, maxCells } = req.body;
    const courierRepository = AppDataSource.getRepository(Courier);
    const courier = await courierRepository.findOne({
      where: { id: req.params.id },
      relations: ['tasks'],
    });

    if (!courier) {
      return res.status(404).json({ error: 'Courier not found' });
    }

    if (fullName !== undefined) courier.fullName = fullName;
    if (workDistrict !== undefined) courier.workDistrict = workDistrict;
    if (maxCells !== undefined) courier.maxCells = maxCells;

    const updatedCourier = await courierRepository.save(courier);
    res.json(updatedCourier);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update courier' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const courierRepository = AppDataSource.getRepository(Courier);
    const result = await courierRepository.delete(req.params.id);
    if (result.affected === 0) {
      return res.status(404).json({ error: 'Courier not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete courier' });
  }
});

export default router;
