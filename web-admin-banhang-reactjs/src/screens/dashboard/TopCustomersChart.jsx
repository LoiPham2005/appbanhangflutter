import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { statisticsService } from '../../services/StatisticsService';
import './TopCustomersChart.css';

const TopCustomersChart = () => {
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDate: new Date()
    });
    const [topCustomers, setTopCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTopCustomers();
    }, [dateRange]);

    const fetchTopCustomers = async () => {
        try {
            setLoading(true);
            const response = await statisticsService.getTopCustomers(
                dateRange.startDate,
                dateRange.endDate
            );
            if (response.status === 200) {
                setTopCustomers(response.data);
            }
        } catch (error) {
            console.error('Error fetching top customers:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="top-customers-container">
            <h2 className="top-customers-title">Top 10 Khách Hàng Mua Nhiều Nhất</h2>
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
                    <table className="customers-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Ảnh</th>
                                <th>Tên khách hàng</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Ngày sinh</th>
                                <th>Số đơn hàng</th>
                                <th>Tổng chi tiêu</th>
                                <th>Lần mua cuối</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topCustomers.map((customer, index) => (
                                <tr key={customer.id} className="customer-row">
                                    <td className="rank-cell">{index + 1}</td>
                                    <td className="image-cell">
                                        <img
                                            src={customer.avatar || '/placeholder.png'}
                                            alt={customer.username}
                                            className="customer-image"
                                        />
                                    </td>
                                    <td className="name-cell">{customer.username}</td>
                                    <td className="email-cell">{customer.email}</td>
                                    <td className="phone-cell">{customer.phone}</td>
                                    <td className="birth-date-cell">{customer.birth_date}</td>
                                    <td className="orders-cell">{customer.totalOrders}</td>
                                    <td className="spent-cell">
                                        {customer.totalSpent.toLocaleString('vi-VN')}đ
                                    </td>
                                    <td className="last-purchase-cell">{customer.lastPurchase}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TopCustomersChart;