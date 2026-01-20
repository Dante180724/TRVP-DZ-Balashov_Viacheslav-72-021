import React, { useState, useEffect } from 'react';
import './CourierForm.css';
import { Courier } from '../types';

interface CourierFormProps {
  districts: string[];
  courier?: Courier | null;
  onSubmit: (data: { fullName: string; workDistrict: string; maxCells: number }) => void;
  onCancel: () => void;
}

const CourierForm: React.FC<CourierFormProps> = ({ districts, courier, onSubmit, onCancel }) => {
  const [fullName, setFullName] = useState('');
  const [workDistrict, setWorkDistrict] = useState('');
  const [maxCells, setMaxCells] = useState(10);

  useEffect(() => {
    if (courier) {
      setFullName(courier.fullName);
      setWorkDistrict(courier.workDistrict);
      setMaxCells(courier.maxCells);
    } else {
      setFullName('');
      setWorkDistrict(districts[0] || '');
      setMaxCells(10);
    }
  }, [courier, districts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !workDistrict) {
      return;
    }
    onSubmit({ fullName: fullName.trim(), workDistrict, maxCells });
    if (!courier) {
      setFullName('');
      setWorkDistrict(districts[0] || '');
      setMaxCells(10);
    }
  };

  if (!courier && districts.length === 0) {
    return (
      <div className="courier-form">
        <p className="info-message">Сначала добавьте хотя бы один район работы.</p>
      </div>
    );
  }

  return (
    <div className="courier-form">
      <h2>{courier ? 'Редактировать курьера' : 'Добавить курьера'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">ФИО *</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="input"
            placeholder="Иванов Иван Иванович"
          />
        </div>
        <div className="form-group">
          <label htmlFor="workDistrict">Район работы *</label>
          <select
            id="workDistrict"
            value={workDistrict}
            onChange={(e) => setWorkDistrict(e.target.value)}
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
          <label htmlFor="maxCells">Максимальное количество ячеек</label>
          <input
            id="maxCells"
            type="number"
            value={maxCells}
            onChange={(e) => setMaxCells(parseInt(e.target.value) || 10)}
            min="1"
            required
            className="input"
          />
        </div>
        {courier && (
          <div className="form-group">
            <label>ID (нередактируемый)</label>
            <input type="text" value={courier.id} disabled className="input input-disabled" />
          </div>
        )}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {courier ? 'Сохранить' : 'Добавить'}
          </button>
          {courier && (
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Отмена
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CourierForm;
