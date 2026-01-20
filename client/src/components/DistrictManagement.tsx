import React, { useState } from 'react';
import './DistrictManagement.css';

interface DistrictManagementProps {
  districts: string[];
  onAddDistrict: (name: string) => void;
}

const DistrictManagement: React.FC<DistrictManagementProps> = ({ districts, onAddDistrict }) => {
  const [newDistrictName, setNewDistrictName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDistrictName.trim()) {
      onAddDistrict(newDistrictName.trim());
      setNewDistrictName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="district-management">
      <div className="district-header">
        <h2>Районы работы</h2>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="btn btn-primary">
            + Добавить район
          </button>
        )}
      </div>
      {isAdding && (
        <form onSubmit={handleSubmit} className="district-form">
          <input
            type="text"
            value={newDistrictName}
            onChange={(e) => setNewDistrictName(e.target.value)}
            placeholder="Название района"
            autoFocus
            className="input"
          />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Добавить</button>
            <button type="button" onClick={() => { setIsAdding(false); setNewDistrictName(''); }} className="btn btn-secondary">
              Отмена
            </button>
          </div>
        </form>
      )}
      <div className="district-list">
        {districts.length === 0 ? (
          <p className="empty-message">Нет районов. Добавьте первый район.</p>
        ) : (
          districts.map((district) => (
            <span key={district} className="district-tag">{district}</span>
          ))
        )}
      </div>
    </div>
  );
};

export default DistrictManagement;
