import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { DeliveryTask } from '../entities/DeliveryTask';
import { Courier } from '../entities/Courier';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const taskRepository = AppDataSource.getRepository(DeliveryTask);
    const tasks = await taskRepository.find({
      relations: ['courier'],
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const taskRepository = AppDataSource.getRepository(DeliveryTask);
    const task = await taskRepository.findOne({
      where: { id: req.params.id },
      relations: ['courier'],
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { orderDescription, cellsOccupied, deliveryDistrict, deliveryAddress, courierId } = req.body;

    if (!orderDescription || !cellsOccupied || !deliveryDistrict || !deliveryAddress || !courierId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const courierRepository = AppDataSource.getRepository(Courier);
    const courier = await courierRepository.findOne({
      where: { id: courierId },
      relations: ['tasks'],
    });

    if (!courier) {
      return res.status(404).json({ error: 'Courier not found' });
    }

    const validationError = validateTaskAssignment(courier, cellsOccupied, deliveryDistrict);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const taskRepository = AppDataSource.getRepository(DeliveryTask);
    const task = taskRepository.create({
      id: uuidv4(),
      orderDescription,
      cellsOccupied: parseInt(cellsOccupied),
      deliveryDistrict,
      deliveryAddress,
      courierId,
    });

    const savedTask = await taskRepository.save(task);
    const taskWithCourier = await taskRepository.findOne({
      where: { id: savedTask.id },
      relations: ['courier'],
    });
    res.status(201).json(taskWithCourier);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.put('/:id/transfer', async (req, res) => {
  try {
    const { newCourierId } = req.body;
    if (!newCourierId) {
      return res.status(400).json({ error: 'New courier ID is required' });
    }

    const taskRepository = AppDataSource.getRepository(DeliveryTask);
    const task = await taskRepository.findOne({
      where: { id: req.params.id },
      relations: ['courier'],
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const courierRepository = AppDataSource.getRepository(Courier);
    const newCourier = await courierRepository.findOne({
      where: { id: newCourierId },
      relations: ['tasks'],
    });

    if (!newCourier) {
      return res.status(404).json({ error: 'New courier not found' });
    }

    const validationError = validateTaskAssignment(newCourier, task.cellsOccupied, task.deliveryDistrict);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    task.courierId = newCourierId;
    const updatedTask = await taskRepository.save(task);
    const taskWithCourier = await taskRepository.findOne({
      where: { id: updatedTask.id },
      relations: ['courier'],
    });
    res.json(taskWithCourier);
  } catch (error) {
    res.status(500).json({ error: 'Failed to transfer task' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const taskRepository = AppDataSource.getRepository(DeliveryTask);
    const result = await taskRepository.delete(req.params.id);
    if (result.affected === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

function validateTaskAssignment(courier: Courier, cellsOccupied: number, deliveryDistrict: string): string | null {
  if (courier.workDistrict !== deliveryDistrict) {
    return `Район доставки не соответствует району работы курьера. Курьер работает в районе: ${courier.workDistrict}`;
  }

  const availableCells = courier.getAvailableCells();
  if (availableCells < cellsOccupied) {
    return `Недостаточно места у курьера. Доступно ячеек: ${availableCells}, требуется: ${cellsOccupied}`;
  }

  return null;
}

export default router;
