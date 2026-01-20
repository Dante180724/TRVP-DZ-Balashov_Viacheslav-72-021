import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import { initializeDefaultDistricts } from './init-data';
import courierRoutes from './routes/courierRoutes';
import districtRoutes from './routes/districtRoutes';
import taskRoutes from './routes/taskRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/couriers', courierRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/tasks', taskRoutes);

AppDataSource.initialize()
  .then(async () => {
    console.log('Database initialized');
    await initializeDefaultDistricts();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error initializing database:', error);
  });
