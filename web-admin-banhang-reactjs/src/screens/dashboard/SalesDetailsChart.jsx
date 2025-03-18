import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2'; // Thay đổi import Chart thành Line
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { statisticsService } from '../../services/StatisticsService';
import './SalesDetailsChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesDetailsChart = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });
  const [chartData, setChartData] = useState({
    labels: [],
    values: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChartData();
  }, [dateRange]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const response = await statisticsService.getRevenueByDateRange(
        dateRange.startDate,
        dateRange.endDate
      );
      if (response.status === 200) {
        setChartData({
          labels: response.data.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('vi-VN', { 
              day: '2-digit',
              month: '2-digit'
            });
          }),
          values: response.data.map(item => item.amount)
        });
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Doanh thu',
        data: chartData.values,
        fill: true,
        borderColor: '#4285f4',
        backgroundColor: 'rgba(66, 133, 244, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#4285f4',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#4285f4',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: function(tooltipItems) {
            return tooltipItems[0].label;
          },
          label: function(context) {
            return `Doanh thu: ${context.parsed.y.toLocaleString('vi-VN')} VND`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#666',
          callback: function(value) {
            return value.toLocaleString('vi-VN') + ' VND';
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      line: {
        borderWidth: 2
      }
    }
  };

  return (
    <div className="sales-chart-container">
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
        <div className="chart-container">
          <Line data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default SalesDetailsChart;