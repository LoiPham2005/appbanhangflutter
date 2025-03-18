import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { productService } from '../../services/ProductService';
import { categoryService } from '../../services/CategoryService';
import './ProductsScreen.css';
import { useTranslation } from 'react-i18next';

function ProductsScreen() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    publishing_house: '',
    price: '',
    description: '',
    stock_quantity: '',
    id_category: '',
    status: 'active',
    media: []
  });
  const [selectedFiles, setSelectedFiles] = useState({
    images: [],
    videos: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Status options - để làm dropdown
  const statusOptions = [
    { value: 'active', label: t('products.status.active') },
    { value: 'out of stock', label: t('products.status.out of stock') },
    { value: 'importing goods', label: t('products.status.importing goods') },
    { value: 'stop selling', label: t('products.status.stop selling') }
  ];

  useEffect(() => {
    fetchCategories();
    fetchProducts();
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

  const fetchProducts = async () => {
    try {
      const result = await productService.getProducts();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e, type) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => ({
      ...prev,
      [type]: [...prev[type], ...files]
    }));
  };

  const handleRemoveFile = (type, index) => {
    setSelectedFiles(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      publishing_house: product.publishing_house,
      price: product.price.toString(),
      description: product.description,
      stock_quantity: product.stock_quantity.toString(),
      id_category: product.id_category,
      status: product.status,
      media: product.media
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let mediaUrls = [];
      // Upload new files if any
      if (selectedFiles.images.length > 0 || selectedFiles.videos.length > 0) {
        try {
          const uploadResponse = await productService.uploadMedia([
            ...selectedFiles.images, 
            ...selectedFiles.videos
          ]);

          if (uploadResponse.status === 200) {
            mediaUrls = uploadResponse.data.map(item => ({
              type: item.type,
              url: item.url
            }));
          } else {
            throw new Error('Upload failed');
          }
        } catch (uploadError) {
          console.error('Error uploading media:', uploadError);
          alert('Có lỗi khi tải lên file media: ' + (uploadError.response?.data?.message || uploadError.message));
          return;
        }
      }

      const productData = {
        title: formData.title.trim(),
        publishing_house: formData.publishing_house.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        stock_quantity: parseInt(formData.stock_quantity),
        id_category: formData.id_category,
        status: formData.status,
        // Combine existing media (if editing) with new uploads
        media: [
          ...(formData.media || []), // Keep remaining existing media
          ...mediaUrls // Add newly uploaded media
        ]
      };

      let response;
      if (editingProduct) {
        response = await productService.updateProduct(editingProduct._id, productData);
      } else {
        response = await productService.addProduct(productData);
      }

      if (response.status === 200) {
        alert(editingProduct ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
        setIsModalOpen(false);
        resetForm();
        await fetchProducts();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Có lỗi xảy ra: ' + (error.message || 'Vui lòng thử lại'));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      publishing_house: '',
      price: '',
      description: '',
      stock_quantity: '',
      id_category: '',
      status: 'active',
      media: []
    });
    setSelectedFiles({
      images: [],
      videos: []
    });
    setEditingProduct(null);
  };

  // Thêm hàm render table rows
  const renderProductRows = () => {
    return products.map(product => (
      <tr key={product._id}>
        <td>
          {product.media && product.media.length > 0 ? (
            <img 
              src={product.media[0].url} 
              alt={product.title} 
              className="product-image"
            />
          ) : (
            <div className="no-image">No Image</div>
          )}
        </td>
        <td>{product.title}</td>
        <td>{product.publishing_house}</td>
        <td>{product.price.toLocaleString('vi-VN')} VNĐ</td>
        <td>{product.stock_quantity}</td>
        <td>
          {categories.find(cat => cat._id === product.id_category)?.name || 'N/A'}
        </td>
        <td>
          {statusOptions.find(option => option.value === product.status)?.label || product.status}
        </td>
        <td>
          <div className="action-buttons">
            <button 
              className="edit-button"
              onClick={() => handleEdit(product)}
            >
              <i className="fas fa-edit"></i>
            </button>
            <button 
              className="delete-button"
              onClick={() => handleDelete(product._id)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  // Thêm hàm xóa sản phẩm
  const handleDelete = async (id) => {
    if (window.confirm(t('products.messages.confirmDelete'))) {
      try {
        const response = await productService.deleteProduct(id);
        if (response.status === 200) {
          alert(t('products.messages.deleteSuccess'));
          fetchProducts(); // Refresh danh sách sau khi xóa
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(t('common.error'));
      }
    }
  };

  return (
    <MainLayout>
      <div className="products-container">
        <div className="page-header">
          <h1>{t('products.title')}</h1>
          <button className="add-button" onClick={() => setIsModalOpen(true)}>
            <i className="fas fa-plus"></i>
            {t('products.addProduct')}
          </button>
        </div>

        {/* Product List Table */}
        <table className="products-table">
          <thead>
            <tr>
              <th>{t('products.form.images')}</th>
              <th>{t('products.form.title')}</th>
              <th>{t('products.form.author')}</th>
              <th>{t('products.form.price')}</th>
              <th>{t('products.form.quantity')}</th>
              <th>{t('products.form.category')}</th>
              <th>{t('products.form.status')}</th>
              <th>{t('common.edit')}</th>
            </tr>
          </thead>
          <tbody>
            {renderProductRows()}
          </tbody>
        </table>

        {/* Add/Edit Product Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingProduct ? t('products.editProduct') : t('products.addProduct')}</h2>
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
                  <label>Media Files</label>
                  <div>
                    <label className="file-input-button">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileSelect(e, 'images')}
                        style={{ display: 'none' }}
                      />
                      Choose Images
                    </label>
                    {' '}
                    <label className="file-input-button">
                      <input
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={(e) => handleFileSelect(e, 'videos')}
                        style={{ display: 'none' }}
                      />
                      Choose Videos
                    </label>
                  </div>

                  {/* Images Preview */}
                  {selectedFiles.images.length > 0 && (
                    <div className="selected-files-container">
                      <h4>Selected Images:</h4>
                      {selectedFiles.images.map((file, index) => (
                        <div key={`image-${index}`} className="file-item">
                          <div className="file-info">
                            <i className="fas fa-image file-icon"></i>
                            <span className="file-name">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            className="remove-file"
                            onClick={() => handleRemoveFile('images', index)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Videos Preview */}
                  {selectedFiles.videos.length > 0 && (
                    <div className="selected-files-container">
                      <h4>Selected Videos:</h4>
                      {selectedFiles.videos.map((file, index) => (
                        <div key={`video-${index}`} className="file-item">
                          <div className="file-info">
                            <i className="fas fa-video file-icon"></i>
                            <span className="file-name">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            className="remove-file"
                            onClick={() => handleRemoveFile('videos', index)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Existing Media Preview */}
                {editingProduct && formData.media && formData.media.length > 0 && (
                  <div className="selected-files-container">
                    <h4>Current Media:</h4>
                    {formData.media.map((media, index) => (
                      <div key={`existing-${index}`} className="file-item">
                        <div className="file-info">
                          <i className={`fas fa-${media.type === 'image' ? 'image' : 'video'} file-icon`}></i>
                          <span className="file-name">
                            {media.url.split('/').pop()}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="remove-file"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              media: prev.media.filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="form-group">
                  <label>{t('products.form.title')}</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('products.form.author')}</label>
                  <input
                    type="text"
                    name="publishing_house"
                    value={formData.publishing_house}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('products.form.price')}</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('products.form.quantity')}</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('products.form.category')}</label>
                  <select
                    name="id_category"
                    value={formData.id_category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">{t('products.form.selectCategory')}</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>{t('products.form.status')}</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>{t('products.form.description')}</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="modal-buttons">
                  <button type="button" onClick={() => setIsModalOpen(false)}>
                    {t('common.cancel')}
                  </button>
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? t('common.loading') : (editingProduct ? t('common.update') : t('common.add'))}
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

export default ProductsScreen;