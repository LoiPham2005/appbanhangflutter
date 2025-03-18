import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { statisticsService } from '../../services/StatisticsService';
import './TopProductsChart.css';

const TopProductsChart = () => {
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDate: new Date()
    });
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTopProducts();
    }, [dateRange]);

    const fetchTopProducts = async () => {
        try {
            setLoading(true);
            const response = await statisticsService.getTopProducts(
                dateRange.startDate,
                dateRange.endDate
            );
            if (response.status === 200) {
                setTopProducts(response.data);
            }
        } catch (error) {
            console.error('Error fetching top products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="top-products-container">
            <h2 className="top-products-title">Top 10 Sản Phẩm Bán Chạy Nhất</h2>
            <div className="date-picker-container">
                <DatePicker
                    selected={dateRange.startDate}
                    onChange={date => setDateRange(prev => ({ ...prev, startDate: date }))}
                    selectsStart
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    dateFormat="dd/MM/yyyy"
                    className="date-picker"
                    placeholderText="Từ ngày"
                />
                <span>đến</span>
                <DatePicker
                    selected={dateRange.endDate}
                    onChange={date => setDateRange(prev => ({ ...prev, endDate: date }))}
                    selectsEnd
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    minDate={dateRange.startDate}
                    dateFormat="dd/MM/yyyy"
                    className="date-picker"
                    placeholderText="Đến ngày"
                />
            </div>

            {loading ? (
                <div className="loading">Đang tải...</div>
            ) : (
                <div className="table-container">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Tác giả</th>
                                <th>Danh mục</th>
                                <th>Giá</th>
                                <th>Số lượng đã bán</th>
                                <th>Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.map((product, index) => (
                                <tr key={product.id} className="product-row">
                                    <td className="rank-cell">{index + 1}</td>
                                    <td className="image-cell">
                                        <img
                                            src={product.image || '/placeholder.png'}
                                            alt={product.title}
                                            className="product-image"
                                        />
                                    </td>
                                    <td className="title-cell">{product.title}</td>
                                    <td className="author-cell">{product.publishing_house}</td>
                                    <td className="category-cell">{product.id_category?.name || 'N/A'}</td>
                                    <td className="price-cell">
                                        {product.price?.toLocaleString('vi-VN')}đ
                                    </td>
                                    <td className="quantity-cell">{product.quantity}</td>
                                    <td className="revenue-cell">
                                        {product.revenue.toLocaleString('vi-VN')}đ
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TopProductsChart;