import React, { useState, useEffect } from 'react';
import './CourierManagement.css';
import { Courier, DeliveryTask } from '../types';
import { courierApi, districtApi, taskApi } from '../services/api';
import CourierList from './CourierList';
import CourierForm from './CourierForm';
import DistrictManagement from './DistrictManagement';
import Notification from './Notification';

const CourierManagement: React.FC = () => {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [editingCourier, setEditingCourier] = useState<Courier | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [couriersData, districtsData] = await Promise.all([
        courierApi.getAll(),
        districtApi.getAll(),
      ]);
      setCouriers(couriersData);
      setDistricts(districtsData);
    } catch (error) {
      showNotification('Ошибка загрузки данных', 'error');
    }
  };

  const showNotification = (message: string, type: 'error' | 'success' = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCreateCourier = async (data: { fullName: string; workDistrict: string; maxCells: number }) => {
    try {
      await courierApi.create(data);
      await loadData();
      showNotification('Курьер успешно добавлен', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Ошибка создания курьера', 'error');
    }
  };

  const handleUpdateCourier = async (id: string, data: { fullName: string; workDistrict: string; maxCells: number }) => {
    try {
      await courierApi.update(id, data);
      await loadData();
      setEditingCourier(null);
      showNotification('Курьер успешно обновлен', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Ошибка обновления курьера', 'error');
    }
  };

  const handleDeleteCourier = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого курьера?')) return;
    try {
      await courierApi.delete(id);
      await loadData();
      showNotification('Курьер успешно удален', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Ошибка удаления курьера', 'error');
    }
  };

  const handleCreateTask = async (courierId: string, taskData: {
    orderDescription: string;
    cellsOccupied: number;
    deliveryDistrict: string;
    deliveryAddress: string;
  }) => {
    try {
      await taskApi.create({ ...taskData, courierId });
      await loadData();
      showNotification('Задание успешно добавлено', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Ошибка создания задания', 'error');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить это задание?')) return;
    try {
      await taskApi.delete(taskId);
      await loadData();
      showNotification('Задание успешно удалено', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Ошибка удаления задания', 'error');
    }
  };

  const handleTransferTask = async (taskId: string, newCourierId: string) => {
    try {
      await taskApi.transfer(taskId, newCourierId);
      await loadData();
      showNotification('Задание успешно перенесено', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Ошибка переноса задания', 'error');
    }
  };

  const handleAddDistrict = async (name: string) => {
    try {
      await districtApi.create(name);
      await loadData();
      showNotification('Район успешно добавлен', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Ошибка добавления района', 'error');
    }
  };

  return (
    <div className="courier-management">
      <Notification notification={notification} onClose={() => setNotification(null)} />
      <DistrictManagement districts={districts} onAddDistrict={handleAddDistrict} />
      <CourierForm
        districts={districts}
        courier={editingCourier}
        onSubmit={editingCourier
          ? (data) => handleUpdateCourier(editingCourier.id, data)
          : handleCreateCourier}
        onCancel={() => setEditingCourier(null)}
      />
      <CourierList
        couriers={couriers}
        districts={districts}
        onEdit={setEditingCourier}
        onDelete={handleDeleteCourier}
        onCreateTask={handleCreateTask}
        onDeleteTask={handleDeleteTask}
        onTransferTask={handleTransferTask}
      />
    </div>
  );
};

export default CourierManagement;
