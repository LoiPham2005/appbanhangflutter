import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/MainLayout';
import { voucherService } from '../../services/VoucherService';
import './VoucherScreen.css';

function VoucherScreen() {
  const { t } = useTranslation();
  const [vouchers, setVouchers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: '',
    condition: '',
    startDate: '',
    endDate: '',
    quantity: ''
  });

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await voucherService.getVouchers();
      if (response.status === 200) {
        setVouchers(response.data);
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: '',
      condition: '',
      startDate: '',
      endDate: '',
      quantity: ''
    });
    setEditingVoucher(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      if (editingVoucher) {
        response = await voucherService.updateVoucher(editingVoucher._id, formData);
      } else {
        response = await voucherService.addVoucher(formData);
      }

      if (response.status === 200) {
        alert(editingVoucher ? t('vouchers.messages.updateSuccess') : t('vouchers.messages.addSuccess'));
        setIsModalOpen(false);
        resetForm();
        fetchVouchers();
      }
    } catch (error) {
      console.error('Error saving voucher:', error);
      alert(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      name: voucher.name,
      code: voucher.code,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      condition: voucher.condition,
      startDate: new Date(voucher.startDate).toISOString().split('T')[0],
      endDate: new Date(voucher.endDate).toISOString().split('T')[0],
      quantity: voucher.quantity
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('vouchers.messages.confirmDelete'))) {
      try {
        const response = await voucherService.deleteVoucher(id);
        if (response.status === 200) {
          alert(t('vouchers.messages.deleteSuccess'));
          fetchVouchers();
        }
      } catch (error) {
        console.error('Error deleting voucher:', error);
        alert(t('common.error'));
      }
    }
  };

  return (
    <MainLayout>
      <div className="vouchers-container">
        <div className="page-header">
          <h1>{t('vouchers.title')}</h1>
          <button className="add-button" onClick={() => setIsModalOpen(true)}>
            <i className="fas fa-plus"></i>
            {t('vouchers.addVoucher')}
          </button>
        </div>

        <table className="vouchers-table">
          <thead>
            <tr>
              <th>{t('vouchers.form.name')}</th>
              <th>{t('vouchers.form.code')}</th>
              <th>{t('vouchers.form.discountValue')}</th>
              <th>{t('vouchers.form.startDate')}</th>
              <th>{t('vouchers.form.endDate')}</th>
              <th>{t('vouchers.form.quantity')}</th>
              <th>{t('common.edit')}</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map(voucher => (
              <tr key={voucher._id}>
                <td>{voucher.name}</td>
                <td>{voucher.code}</td>
                <td>{voucher.discountValue}{voucher.discountType === 'percentage' ? '%' : 'đ'}</td>
                <td>{new Date(voucher.startDate).toLocaleDateString()}</td>
                <td>{new Date(voucher.endDate).toLocaleDateString()}</td>
                <td>{voucher.quantity}</td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-button" onClick={() => handleEdit(voucher)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="delete-button" onClick={() => handleDelete(voucher._id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingVoucher ? t('vouchers.editVoucher') : t('vouchers.addVoucher')}</h2>
                <button className="close-button" onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>{t('vouchers.form.name')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('vouchers.form.code')}</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('vouchers.form.discountType')}</label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="percentage">{t('vouchers.form.percentage')}</option>
                    <option value="fixed">{t('vouchers.form.fixed')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{t('vouchers.form.discountValue')}</label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>{t('vouchers.form.condition')}</label>
                  <input
                    type="text"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>{t('vouchers.form.startDate')}</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('vouchers.form.endDate')}</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('vouchers.form.quantity')}</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>

                <div className="modal-buttons">
                  <button type="button" onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}>
                    {t('common.cancel')}
                  </button>
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? t('common.loading') : (editingVoucher ? t('common.update') : t('common.add'))}
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

export default VoucherScreen;
