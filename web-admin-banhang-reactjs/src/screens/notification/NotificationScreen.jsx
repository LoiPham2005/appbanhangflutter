import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useTranslation } from 'react-i18next';
import { notificationService } from '../../services/NotificationService';
import { useTheme } from '../../contexts/ThemeContext';
import './NotificationScreen.css';
import { FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';

export default function NotificationScreen() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'system'
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getAllNotifications();
      if (response.status === 200) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedNotification(null);
    setFormData({ title: '', message: '', type: 'system' });
    setIsModalOpen(true);
  };

  const handleEdit = (notification) => {
    setSelectedNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        const response = await notificationService.deleteNotification(id);
        if (response.status === 200) {
          alert('Notification deleted successfully');
          fetchNotifications();
        }
      } catch (error) {
        console.error('Error deleting notification:', error);
        alert('Error deleting notification');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title.trim() || !formData.message.trim()) {
        alert('Please fill in all required fields');
        return;
      }

      const notificationData = {
        ...formData,
        data: {}
      };

      if (selectedNotification) {
        const response = await notificationService.updateNotification(
          selectedNotification._id,
          notificationData
        );
        if (response.status === 200) {
          alert('Notification updated successfully');
        }
      } else {
        const response = await notificationService.createNotification(notificationData);
        if (response.status === 200) {
          alert('Notification created successfully');
        }
      }
      setIsModalOpen(false);
      fetchNotifications();
    } catch (error) {
      console.error('Error submitting notification:', error);
      alert(`Error: ${error.response?.data?.message || 'Failed to process notification'}`);
    }
  };

  // Add CSS for modal
  const modalStyle = {
    modal: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      width: '500px',
      maxWidth: '90%'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px'
    },
    input: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd'
    },
    textarea: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      minHeight: '100px'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '20px'
    },
    button: {
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer'
    },
    saveButton: {
      backgroundColor: '#4CAF50',
      color: 'white'
    },
    cancelButton: {
      backgroundColor: '#f44336',
      color: 'white'
    }
  };

  return (
    <MainLayout>
      <div className="notifications-container">
        <div className="page-header">
          <h1>{t('notifications.title')}</h1>
          <button className="add-button" onClick={handleAdd}>
            {t('common.add')}
          </button>
        </div>

        {loading ? (
          <div className="loading">{t('common.loading')}</div>
        ) : (
          <table className="notifications-table">
            <thead>
              <tr>
                <th>{t('notifications.titleColumn')}</th>
                <th>{t('notifications.message')}</th>
                <th>{t('notifications.type')}</th>
                <th>{t('notifications.status')}</th>
                <th>{t('notifications.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification) => (
                <tr key={notification._id}>
                  <td>{notification.title}</td>
                  <td>{notification.message}</td>
                  <td>{t(`notifications.types.${notification.type}`)}</td>
                  <td>
                    {notification.isRead ? (
                      <FaCheckCircle className="read-icon" />
                    ) : (
                      <span className="unread-badge">{t('notifications.unread')}</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(notification)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(notification._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {isModalOpen && (
          <div style={modalStyle.modal}>
            <div style={modalStyle.modalContent}>
              <h2>{selectedNotification ? 'Edit Notification' : 'Add New Notification'}</h2>
              <form onSubmit={handleSubmit}>
                <div style={modalStyle.formGroup}>
                  <label style={modalStyle.label}>Title:</label>
                  <input
                    type="text"
                    style={modalStyle.input}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div style={modalStyle.formGroup}>
                  <label style={modalStyle.label}>Message:</label>
                  <textarea
                    style={modalStyle.textarea}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <div style={modalStyle.formGroup}>
                  <label style={modalStyle.label}>Type:</label>
                  <select
                    style={modalStyle.input}
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="system">System</option>
                    <option value="order">Order</option>
                    <option value="promotion">Promotion</option>
                  </select>
                </div>

                <div style={modalStyle.buttonGroup}>
                  <button
                    type="submit"
                    style={{ ...modalStyle.button, ...modalStyle.saveButton }}
                  >
                    {selectedNotification ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    style={{ ...modalStyle.button, ...modalStyle.cancelButton }}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}