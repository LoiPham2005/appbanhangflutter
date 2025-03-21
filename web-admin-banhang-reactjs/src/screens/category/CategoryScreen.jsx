import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { categoryService } from '../../services/CategoryService';
import './CategoryScreen.css';
import { useTranslation } from 'react-i18next';

function CategoryScreen() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const result = await categoryService.getCategories();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const categoryData = {
        name: formData.name.trim()
      };

      let response;
      if (editingCategory) {
        response = await categoryService.updateCategory(editingCategory._id, categoryData);
      } else {
        response = await categoryService.addCategory(categoryData);
      }

      if (response.status === 200) {
        alert(editingCategory ? t('categories.messages.updateSuccess') : t('categories.messages.addSuccess'));
        setIsModalOpen(false);
        resetForm();
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('categories.messages.confirmDelete'))) {
      try {
        const response = await categoryService.deleteCategory(id);
        if (response.status === 200) {
          alert(t('categories.messages.deleteSuccess'));
          await fetchCategories();
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert(t('common.error'));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: ''
    });
    setEditingCategory(null);
  };

  return (
    <MainLayout>
      <div className="categories-container">
        <div className="page-header">
          <h1>{t('categories.title')}</h1>
          <button className="add-button" onClick={() => setIsModalOpen(true)}>
            <i className="fas fa-plus"></i>
            {t('categories.addCategory')}
          </button>
        </div>

        <table className="categories-table">
          <thead>
            <tr>
              <th>{t('categories.form.name')}</th>
              <th>{t('common.edit')}</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit(category)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(category._id)}
                    >
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
                <h2>{editingCategory ? t('categories.editCategory') : t('categories.addCategory')}</h2>
                <button 
                  className="close-button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>{t('categories.form.name')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
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
                    {isLoading ? t('common.loading') : (editingCategory ? t('common.update') : t('common.add'))}
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

export default CategoryScreen;