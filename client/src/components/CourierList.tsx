import React, { useState } from 'react';
import './CourierList.css';
import { Courier, DeliveryTask } from '../types';
import CourierCard from './CourierCard';
import TaskForm from './TaskForm';

interface CourierListProps {
  couriers: Courier[];
  districts: string[];
  onEdit: (courier: Courier) => void;
  onDelete: (id: string) => void;
  onCreateTask: (courierId: string, taskData: {
    orderDescription: string;
    cellsOccupied: number;
    deliveryDistrict: string;
    deliveryAddress: string;
  }) => void;
  onDeleteTask: (taskId: string) => void;
  onTransferTask: (taskId: string, newCourierId: string) => void;
}

const CourierList: React.FC<CourierListProps> = ({
  couriers,
  districts,
  onEdit,
  onDelete,
  onCreateTask,
  onDeleteTask,
  onTransferTask,
}) => {
  const [addingTaskToCourier, setAddingTaskToCourier] = useState<string | null>(null);

  const getOccupiedCells = (courier: Courier): number => {
    if (!courier.tasks) return 0;
    return courier.tasks.reduce((sum, task) => sum + task.cellsOccupied, 0);
  };

  const getAvailableCells = (courier: Courier): number => {
    return courier.maxCells - getOccupiedCells(courier);
  };

  return (
    <div className="courier-list">
      <h2>Список курьеров</h2>
      {couriers.length === 0 ? (
        <p className="empty-message">Нет курьеров. Добавьте первого курьера.</p>
      ) : (
        <div className="courier-grid">
          {couriers.map((courier) => (
            <CourierCard
              key={courier.id}
              courier={courier}
              districts={districts}
              occupiedCells={getOccupiedCells(courier)}
              availableCells={getAvailableCells(courier)}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddTask={() => setAddingTaskToCourier(courier.id)}
              onDeleteTask={onDeleteTask}
              onTransferTask={onTransferTask}
              otherCouriers={couriers.filter((c) => c.id !== courier.id)}
            />
          ))}
        </div>
      )}
      {addingTaskToCourier && (
        <TaskForm
          courierId={addingTaskToCourier}
          districts={districts}
          onSubmit={(taskData) => {
            onCreateTask(addingTaskToCourier, taskData);
            setAddingTaskToCourier(null);
          }}
          onCancel={() => setAddingTaskToCourier(null)}
        />
      )}
    </div>
  );
};

export default CourierList;
