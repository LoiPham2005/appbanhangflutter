import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { statisticsService } from '../../services/StaticsService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { RefreshControl } from 'react-native';

const StatisticsScreen = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [filterType, setFilterType] = useState('daily'); // daily, weekly, monthly, yearly
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date()
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState(null);

  const fetchStatistics = async () => {
    try {
        setLoading(true);
        const response = await statisticsService.getDailyReport(
            dateRange.startDate.toISOString(),
            dateRange.endDate.toISOString()
        );
        if (response.success) {
            setStatsData(response.data);
        } else {
            Alert.alert('Lỗi', response.message || 'Không thể tải dữ liệu thống kê');
        }
    } catch (error) {
        console.error('Error fetching statistics:', error);
        Alert.alert('Lỗi', 'Không thể tải dữ liệu thống kê');
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateRange(prev => ({
        ...prev,
        [selectedDateType]: selectedDate
      }));
    }
  };

  const chartConfig = {
    backgroundColor: theme.backgroundColor,
    backgroundGradientFrom: theme.backgroundColor,
    backgroundGradientTo: theme.backgroundColor,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    style: {
      borderRadius: 16
    }
  };

  const renderRevenueChart = () => {
    if (!statsData) return null;

    return (
      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, { color: theme.textColor }]}>
          {t('statistics.charts.paymentMethod')}
        </Text>
        <PieChart
          data={[
            {
              name: 'Tiền mặt',
              population: statsData.paymentMethodStats.cod.amount,
              color: '#FF6B6B',
              legendFontColor: theme.textColor
            },
            {
              name: 'Ví điện tử',
              population: statsData.paymentMethodStats.wallet.amount,
              color: '#4ECDC4',
              legendFontColor: theme.textColor
            }
          ]}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>
    );
  };

  const renderTrendChart = () => {
    if (!statsData?.revenueHistory || statsData.revenueHistory.length === 0) return null;

    const data = {
        labels: statsData.revenueHistory.map(item => {
            const date = new Date(item.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        }),
        datasets: [{
            data: statsData.revenueHistory.map(item => item.amount)
        }]
    };

    return (
        <View style={styles.chartContainer}>
            <Text style={[styles.chartTitle, { color: theme.textColor }]}>
                {t('statistics.charts.trend')}
            </Text>
            <LineChart
                data={data}
                width={Dimensions.get('window').width - 32}
                height={220}
                chartConfig={{
                    backgroundColor: theme.backgroundColor,
                    backgroundGradientFrom: theme.backgroundColor,
                    backgroundGradientTo: theme.backgroundColor,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    formatYLabel: (value) => value.toLocaleString('vi-VN'),
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        </View>
    );
};

  const renderTopProducts = () => {
    if (!statsData?.topSellingProducts) return null;

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
          {t('statistics.topProducts.title')}
        </Text>
        {statsData.topSellingProducts.map((product, index) => (
          <View key={index} style={styles.productItem}>
            <Text style={[styles.productName, { color: theme.textColor }]}>
              {index + 1}. {product.productId}
            </Text>
            <Text style={[styles.productStats, { color: theme.textColor }]}>
              SL: {product.quantity} | DT: {product.revenue.toLocaleString('vi-VN')}đ
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={fetchStatistics}
          colors={['#0000ff']}
          tintColor={theme.textColor}
        />
      }
    >
      <View style={styles.filterContainer}>
        <View style={styles.dateRangeContainer}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setSelectedDateType('startDate');
              setShowDatePicker(true);
            }}
          >
            <Text style={{ color: theme.textColor }}>
              {t('statistics.dateRange.from')}: {dateRange.startDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setSelectedDateType('endDate');
              setShowDatePicker(true);
            }}
          >
            <Text style={{ color: theme.textColor }}>
              {t('statistics.dateRange.to')}: {dateRange.endDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dateRange[selectedDateType]}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.textColor }]}>
                {t('statistics.summary.totalRevenue')}
              </Text>
              <Text style={[styles.summaryValue, { color: theme.textColor }]}>
                {statsData?.totalRevenue?.toLocaleString('vi-VN')}đ
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.textColor }]}>
                {t('statistics.summary.totalOrders')}
              </Text>
              <Text style={[styles.summaryValue, { color: theme.textColor }]}>
                {statsData?.totalOrders}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.textColor }]}>
                {t('statistics.summary.totalProducts')}
              </Text>
              <Text style={[styles.summaryValue, { color: theme.textColor }]}>
                {statsData?.totalProductsSold}
              </Text>
            </View>
          </View>

          {renderRevenueChart()}
          {renderTrendChart()}
          {renderTopProducts()}
        </>
      )}
    </ScrollView>
  );
};

const CustomDrawerContent = (props) => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const { isDarkMode, setIsDarkMode, theme } = useTheme();
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    avatar: null,
    role: 'user' // Add role
  });

  const fetchUserInfo = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString) {
        const info = JSON.parse(userInfoString);
        setUserInfo({
          name: info.name,
          email: info.email,
          avatar: info.avatar,
          role: info.role || 'user'
        });
      }
    } catch (error) {
      console.error('Error getting user info:', error);
    }
  };

  // Common menu items for all users
  const commonMenuItems = () => (
    <>
      <DrawerItem
        label={t('home')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="home" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('Home')}
      />
      <DrawerItem
        label={t('cartName')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="shopping-cart" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('Cart')}
      />
      <DrawerItem
        label={t('profileName')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="user" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('Profile')}
      />
    </>
  );

  // Menu items for normal users
  const userMenuItems = () => (
    <>
      <DrawerItem
        label={t('orderName')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="list" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('Order')}
      />
    </>
  );

  // Menu items for admin users
  const adminMenuItems = () => (
    <>
      <DrawerItem
        label={t('orderMana')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="list" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('OrderMana')}
      />
      <DrawerItem
        label={t('account')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="users" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('Account')}
      />
      <DrawerItem
        label={t('productMana')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="box" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('Product')}
      />
      <DrawerItem
        label={t('statistics')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="bar-chart-2" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('Statistics')}
      />
    </>
  );

  // Common settings items
  const settingsItems = () => (
    <>
      <DrawerItem
        label={t('settings')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="settings" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('Settings')}
      />
      <DrawerItem
        label={t('support')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="help-circle" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('Support')}
      />
      <DrawerItem
        label={t('aboutUs')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="info" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('AboutUs')}
      />
    </>
  );

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: theme.backgroundColor }}>
      {/* User Profile Section */}
      <View style={[styles.headerContainer, { backgroundColor: isDarkMode ? '#333' : '#f6f6f6' }]}>
        {/* ... existing profile UI code ... */}
      </View>

      {/* Common Menu Items */}
      {commonMenuItems()}

      {/* Role-based Menu Items */}
      {userInfo.role === 'admin' ? adminMenuItems() : userMenuItems()}

      {/* Settings Section */}
      <View style={[styles.sectionDivider, { backgroundColor: isDarkMode ? '#333' : '#f6f6f6' }]}>
        <Text style={[styles.sectionText, { color: theme.textColor }]}>{t('other')}</Text>
      </View>

      {/* Common Settings Items */}
      {settingsItems()}

      {/* Language and Theme Toggles */}
      {/* ... existing language and theme toggle code ... */}

      {/* Logout Section */}
      <View style={[styles.sectionDivider, { backgroundColor: isDarkMode ? '#333' : '#f6f6f6' }]}>
        <Text style={[styles.sectionText, { color: theme.textColor }]}>{t('exit')}</Text>
      </View>

      <DrawerItem
        label={t('logout')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="log-out" size={size} color={theme.textColor} />}
        onPress={async () => {
          await AsyncStorage.clear();
          props.navigation.replace('Login');
        }}
      />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  filterContainer: {
    marginBottom: 20,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    minWidth: 150,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  summaryItem: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productItem: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  productStats: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default StatisticsScreen;