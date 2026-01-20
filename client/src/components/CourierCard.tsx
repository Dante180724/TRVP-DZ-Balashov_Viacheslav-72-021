import React, { useState } from 'react';
import './CourierCard.css';
import { Courier, DeliveryTask } from '../types';

interface CourierCardProps {
  courier: Courier;
  districts: string[];
  occupiedCells: number;
  availableCells: number;
  onEdit: (courier: Courier) => void;
  onDelete: (id: string) => void;
  onAddTask: () => void;
  onDeleteTask: (taskId: string) => void;
  onTransferTask: (taskId: string, newCourierId: string) => void;
  otherCouriers: Courier[];
}

const CourierCard: React.FC<CourierCardProps> = ({
  courier,
  districts,
  occupiedCells,
  availableCells,
  onEdit,
  onDelete,
  onAddTask,
  onDeleteTask,
  onTransferTask,
  otherCouriers,
}) => {
  const [transferringTaskId, setTransferringTaskId] = useState<string | null>(null);
  const [selectedNewCourierId, setSelectedNewCourierId] = useState<string>('');

  const handleTransfer = (taskId: string) => {
    if (selectedNewCourierId) {
      onTransferTask(taskId, selectedNewCourierId);
      setTransferringTaskId(null);
      setSelectedNewCourierId('');
    }
  };

  const tasks = courier.tasks || [];
  const capacityPercent = (occupiedCells / courier.maxCells) * 100;

  return (
    <div className="courier-card">
      <div className="courier-card-header">
        <div>
          <h3>{courier.fullName}</h3>
          <p className="courier-id">ID: {courier.id}</p>
          <p className="courier-district">Район: {courier.workDistrict}</p>
        </div>
        <div className="courier-actions">
          <button onClick={() => onEdit(courier)} className="btn btn-sm btn-secondary">
            Редактировать
          </button>
          <button onClick={() => onDelete(courier.id)} className="btn btn-sm btn-danger">
            Удалить
          </button>
        </div>
      </div>

      <div className="capacity-info">
        <div className="capacity-bar">
          <div
            className="capacity-fill"
            style={{ width: `${Math.min(capacityPercent, 100)}%` }}
          />
        </div>
        <div className="capacity-text">
          <span>Занято: {occupiedCells} / {courier.maxCells}</span>
          <span>Свободно: {availableCells}</span>
        </div>
      </div>

      <div className="tasks-section">
        <div className="tasks-header">
          <h4>Задания ({tasks.length})</h4>
          <button onClick={onAddTask} className="btn btn-sm btn-primary">
            + Добавить задание
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="no-tasks">Нет заданий</p>
        ) : (
          <div className="tasks-list">
            {tasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-info">
                  <div className="task-description">{task.orderDescription}</div>
                  <div className="task-details">
                    <span>Ячеек: {task.cellsOccupied}</span>
                    <span>Район: {task.deliveryDistrict}</span>
                    <span>Адрес: {task.deliveryAddress}</span>
                  </div>
                  <div className="task-id">ID: {task.id}</div>
                </div>
                <div className="task-actions">
                  {transferringTaskId === task.id ? (
                    <div className="transfer-form">
                      <select
                        value={selectedNewCourierId}
                        onChange={(e) => setSelectedNewCourierId(e.target.value)}
                        className="input input-sm"
                      >
                        <option value="">Выберите курьера</option>
                        {otherCouriers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.fullName} ({c.workDistrict})
                          </option>
                        ))}
                      </select>
                      <div className="transfer-actions">
                        <button
                          onClick={() => handleTransfer(task.id)}
                          disabled={!selectedNewCourierId}
                          className="btn btn-sm btn-primary"
                        >
                          Перенести
                        </button>
                        <button
                          onClick={() => {
                            setTransferringTaskId(null);
                            setSelectedNewCourierId('');
                          }}
                          className="btn btn-sm btn-secondary"
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {otherCouriers.length > 0 && (
                        <button
                          onClick={() => setTransferringTaskId(task.id)}
                          className="btn btn-sm btn-secondary"
                        >
                          Перенести
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Удалить
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourierCard;
