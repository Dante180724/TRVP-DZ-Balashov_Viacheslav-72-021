import React, { useState, useEffect } from 'react';
import './TaskForm.css';

interface TaskFormProps {
  courierId: string;
  districts: string[];
  onSubmit: (data: {
    orderDescription: string;
    cellsOccupied: number;
    deliveryDistrict: string;
    deliveryAddress: string;
  }) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ courierId, districts, onSubmit, onCancel }) => {
  const [orderDescription, setOrderDescription] = useState('');
  const [cellsOccupied, setCellsOccupied] = useState(1);
  const [deliveryDistrict, setDeliveryDistrict] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    if (districts.length > 0) {
      setDeliveryDistrict(districts[0]);
    }
  }, [districts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderDescription.trim() || !deliveryDistrict || !deliveryAddress.trim()) {
      return;
    }
    onSubmit({
      orderDescription: orderDescription.trim(),
      cellsOccupied,
      deliveryDistrict,
      deliveryAddress: deliveryAddress.trim(),
    });
    setOrderDescription('');
    setCellsOccupied(1);
    setDeliveryAddress('');
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form">
        <h3>Добавить задание</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="orderDescription">Описание заказа *</label>
            <input
              id="orderDescription"
              type="text"
              value={orderDescription}
              onChange={(e) => setOrderDescription(e.target.value)}
              required
              className="input"
              placeholder="Например: Доставка продуктов"
            />
          </div>
          <div className="form-group">
            <label htmlFor="cellsOccupied">Количество ячеек *</label>
            <input
              id="cellsOccupied"
              type="number"
              value={cellsOccupied}
              onChange={(e) => setCellsOccupied(parseInt(e.target.value) || 1)}
              min="1"
              required
              className="input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="deliveryDistrict">Район доставки *</label>
            <select
              id="deliveryDistrict"
              value={deliveryDistrict}
              onChange={(e) => setDeliveryDistrict(e.target.value)}
              required
              className="input"
            >
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="deliveryAddress">Адрес доставки *</label>
            <input
              id="deliveryAddress"
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
              className="input"
              placeholder="Например: ул. Ленина, д. 10, кв. 5"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Добавить
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
