import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/MainLayout';
import { productService } from '../../services/ProductService';
import './ProductStockScreen.css';

function ProductStockScreen() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'out of stock':
        return '#f44336';
      case 'importing goods':
        return '#2196F3';
      case 'stop selling':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <MainLayout>
      <div className="stock-container">
        <div className="page-header">
          <h1>{t('productStock.title')}</h1>
        </div>

        <div className="stock-grid">
          {products.map(product => (
            <div key={product._id} className="stock-card">
              <div className="stock-image">
                {product.media && product.media.length > 0 && (
                  <img 
                    src={product.media[0].url} 
                    alt={product.title}
                  />
                )}
              </div>
              <div className="stock-info">
                <h3>{product.title}</h3>
                <p>{product.publishing_house}</p>
                <div className="stock-details">
                  <div className="stock-quantity">
                    <span>{t('productStock.quantity')}</span>
                    <strong>{product.stock_quantity}</strong>
                  </div>
                  <div 
                    className="stock-status"
                    style={{ backgroundColor: getStatusColor(product.status) }}
                  >
                    {t(`products.status.${product.status}`)}
                  </div>
                </div>
                <div className="stock-progress">
                  <div 
                    className="progress-bar"
                    style={{
                      width: `${Math.min((product.stock_quantity / 100) * 100, 100)}%`,
                      backgroundColor: getStatusColor(product.status)
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner" />
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ProductStockScreen;