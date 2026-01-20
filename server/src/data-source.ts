import { DataSource } from 'typeorm';
import { Courier } from './entities/Courier';
import { DeliveryTask } from './entities/DeliveryTask';
import { District } from './entities/District';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'courier_management.db',
  synchronize: true,
  logging: false,
  entities: [Courier, DeliveryTask, District],
  migrations: [],
  subscribers: [],
});
