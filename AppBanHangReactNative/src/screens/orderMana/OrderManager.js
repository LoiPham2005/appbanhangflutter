import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { TabView, TabBar } from 'react-native-tab-view';
import { Dimensions } from 'react-native';
import { orderService } from '../../services/OrderService';
import { notificationService } from '../../services/NotificationService'; // Thêm dòng này
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Thêm import này
import { NotificationHelper } from '../../utils/NotificationHelper';

const OrderManagerScreen = () => {
  const navigation = useNavigation(); // Thêm dòng này
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [index, setIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const [routes] = useState([
    { key: 'pending', title: t('orderManagement.status.pending') },
    { key: 'confirmed', title: t('orderManagement.status.confirmed') },
    { key: 'shipping', title: t('orderManagement.status.shipping') },
    { key: 'delivered', title: t('orderManagement.status.delivered') },
    { key: 'return_requested', title: t('orderManagement.status.return_requested') },
    { key: 'returned', title: t('orderManagement.status.returned') },
    { key: 'cancelled', title: t('orderManagement.status.cancelled') }
  ]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders();
      if (response.status === 200) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
      setRefreshing(false); // Add this line
    }
  };

  // Add onRefresh handler
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus, userId) => {
    try {
      const response = await orderService.updateOrderStatus(orderId, newStatus);
      if (response.status === 200) {
        let title = '';
        let message = '';

        switch (newStatus) {
          case 'confirmed':
            title = 'Đơn hàng được xác nhận';
            message = `Đơn hàng #${orderId.slice(-6)} đã được xác nhận`;
            break;
          case 'shipping':
            title = 'Đơn hàng đang giao';
            message = `Đơn hàng #${orderId.slice(-6)} đang được giao`;
            break;
          case 'delivered':
            title = 'Đơn hàng đã giao';
            message = `Đơn hàng #${orderId.slice(-6)} đã giao thành công`;
            break;
          case 'cancelled':
            title = 'Đơn hàng đã hủy';
            message = `Đơn hàng #${orderId.slice(-6)} đã bị hủy`;
            break;
        }

        // Gửi thông báo socket và notification
        const notificationData = {
          userId,
          title,
          message,
          type: 'order',
          data: {
            orderId,
            status: newStatus,
            updatedAt: new Date().toISOString()
          }
        };

        // Gửi notification trước
        await NotificationHelper.showLocalNotification(
          title,
          message,
          {
            orderId,
            status: newStatus,
            type: 'order',
            channelId: 'orders'
          }
        );

        // Sau đó gửi socket notification
        await notificationService.createNotification(notificationData);

        fetchOrders();
        Alert.alert('Thành công', t('orderManagement.messages.updateSuccess'));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Lỗi', t('orderManagement.messages.updateError'));
    }
  };

  const handleReturn = async (orderId, userId) => {
    Alert.alert(
      'Xác nhận trả hàng',
      t('orderManagement.messages.confirmReturn'),
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: async () => {
            try {
              const response = await orderService.returnOrder(orderId, {
                status: 'returned',
                returnDate: new Date().toISOString()
              });

              if (response && response.status === 200) {
                const title = 'Yêu cầu trả hàng được chấp nhận';
                const message = `Đơn hàng #${orderId.slice(-6)} đã được xác nhận trả hàng`;

                // Gửi thông báo nền
                await NotificationHelper.showLocalNotification(
                  title,
                  message,
                  {
                    orderId,
                    status: 'returned',
                    isAdmin: false // Đánh dấu là thông báo cho user
                  }
                );

                // Gửi thông báo socket
                const notificationData = {
                  userId,
                  title,
                  message,
                  type: 'order',
                  data: {
                    orderId,
                    status: 'returned',
                    updatedAt: new Date().toISOString()
                  }
                };

                await notificationService.createNotification(notificationData);
                console.log('Return notification sent to user:', userId);

                fetchOrders();
                Alert.alert('Thành công', t('orderManagement.messages.returnSuccess'));
              } else {
                Alert.alert('Lỗi', response?.message || 'Không thể xác nhận trả hàng');
              }
            } catch (error) {
              console.error('Error processing return:', error);
              Alert.alert('Lỗi', 'Không thể xử lý yêu cầu trả hàng');
            }
          }
        }
      ]
    );
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('OrderDetail', { order: item })}
      style={[styles.orderCard, { backgroundColor: theme.backgroundColor }]}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={[styles.orderId, { color: theme.textColor }]}>
            {t('orderManagement.orderInfo.orderId', { id: item._id.slice(-6) })}
          </Text>
          <Text style={[styles.orderDate, { color: theme.textColor }]}>
            {new Date(item.createdAt).toLocaleString('vi-VN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.orderInfo}>
        <Text style={[styles.customerName, { color: theme.textColor }]}>
          {t('orderManagement.orderInfo.customerName', { name: item.id_user?.username || 'N/A' })}
        </Text>
        <Text style={[styles.orderTotal, { color: theme.textColor }]}>
          {t('orderManagement.orderInfo.total', { amount: item.finalTotal.toLocaleString('vi-VN') })}
        </Text>
        <Text style={[styles.orderAddress, { color: theme.textColor }]}>
          {t('orderManagement.orderInfo.address', { address: item.shippingAddress })}
        </Text>
      </View>

      {/* Action buttons based on order status */}
      <View style={styles.actionButtons}>
        {item.status === 'pending' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
              onPress={() => handleUpdateStatus(item._id, 'confirmed', item.id_user?._id)}
            >
              <Text style={styles.buttonText}>{t('orderManagement.actions.confirm')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#F44336', marginLeft: 8 }]}
              onPress={() => handleUpdateStatus(item._id, 'cancelled', item.id_user?._id)}
            >
              <Text style={styles.buttonText}>{t('orderManagement.actions.cancel')}</Text>
            </TouchableOpacity>
          </>
        )}

        {item.status === 'confirmed' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
            onPress={() => handleUpdateStatus(item._id, 'shipping', item.id_user?._id)}
          >
            <Text style={styles.buttonText}>{t('orderManagement.actions.ship')}</Text>
          </TouchableOpacity>
        )}

        {item.status === 'shipping' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => handleUpdateStatus(item._id, 'delivered', item.id_user?._id)}
          >
            <Text style={styles.buttonText}>{t('orderManagement.actions.confirmDelivery')}</Text>
          </TouchableOpacity>
        )}

        {item.status === 'return_requested' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.returnButton]}
            onPress={() => handleReturn(item._id, item.id_user?._id)}
          >
            <Text style={styles.buttonText}>{t('orderManagement.actions.returnConfirm')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'confirmed':
        return '#2196F3';
      case 'shipping':
        return '#9C27B0';
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#000';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return t('orderManagement.status.pending');
      case 'confirmed':
        return t('orderManagement.status.confirmed');
      case 'shipping':
        return t('orderManagement.status.shipping');
      case 'delivered':
        return t('orderManagement.status.delivered');
      case 'cancelled':
        return t('orderManagement.status.cancelled');
      default:
        return status;
    }
  };

  const renderScene = ({ route }) => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    const filteredOrders = orders.filter(order => order.status === route.key);

    return (
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <Text style={[styles.emptyText, { color: theme.textColor }]}>
            Không có đơn hàng nào
          </Text>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
            tintColor={theme.textColor}
          />
        }
      />
    );
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={{ backgroundColor: '#2196F3' }}
      style={{ backgroundColor: theme.backgroundColor }}
      labelStyle={{ fontSize: 12 }}
      activeColor="#2196F3"
      inactiveColor={theme.textColor}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
      renderTabBar={renderTabBar}
    />
  );
};

// Helper function to create notification
const createNotification = async (userId, title, message, type = 'order') => {
  try {
    await notificationService.createNotification({
      userId,
      title,
      message,
      type,
      isRead: false,
      data: {}
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Sửa lại hàm handlePlaceOrder
const handlePlaceOrder = async () => {
  if (!address) {
    Alert.alert('Thông báo', 'Vui lòng chọn địa chỉ giao hàng');
    return;
  }

  const finalTotal = calculateTotal();

  Alert.alert(
    'Xác nhận đặt hàng',
    paymentMethod === 'wallet'
      ? 'Bạn có chắc chắn muốn thanh toán bằng ví MoMo không?'
      : 'Bạn có chắc chắn muốn đặt hàng không?',
    [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đặt hàng',
        onPress: async () => {
          try {
            setIsLoading(true);
            // Sửa đổi cách tạo orderData
            const orderData = {
              id_user: userId,
              items: selectedItems.map(item => ({
                // Sử dụng id của sản phẩm từ productDetails
                id_product: item.productDetails._id, // Thay đổi ở đây
                purchaseQuantity: item.purchaseQuantity,
                price: parseFloat(item.productDetails.price)
              })),
              totalPrice: parseFloat(totalPrice),
              shippingFee: parseFloat(shippingFee),
              discount: parseFloat(discount),
              finalTotal: parseFloat(finalTotal),
              paymentMethod: paymentMethod,
              shippingAddress: address,
              voucherId: selectedVoucher?._id
            };

            console.log('Order Data:', JSON.stringify(orderData, null, 2)); // Thêm log để debug

            const orderResponse = await orderService.createOrder(orderData);

            if (orderResponse.status === 200) {
              try {
                await orderMessage(orderResponse);
              } catch (error) {
                console.error('Error sending notification:', error);
              }
              navigation.replace('SuccessfulPayment');
            } else {
              Alert.alert('Lỗi', 'Không thể tạo đơn hàng');
            }
          } catch (error) {
            console.error('Order error:', error);
            Alert.alert('Lỗi', 'Không thể tạo đơn hàng');
          } finally {
            setIsLoading(false);
          }
        }
      }
    ]
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
  },
  orderInfo: {
    marginTop: 8,
  },
  customerName: {
    fontSize: 14,
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderAddress: {
    fontSize: 13,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  shippingButton: {
    backgroundColor: '#9C27B0',
  },
  deliveredButton: {
    backgroundColor: '#4CAF50',
  },
  returnButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  }
});

export default OrderManagerScreen;