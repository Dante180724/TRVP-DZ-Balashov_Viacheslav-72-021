import React from 'react';
import './Notification.css';

interface NotificationProps {
  notification: { message: string; type: 'error' | 'success' } | null;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <div className={`notification notification-${notification.type}`}>
      <span>{notification.message}</span>
      <button onClick={onClose} className="notification-close">×</button>
    </div>
  );
};

export default Notification;
