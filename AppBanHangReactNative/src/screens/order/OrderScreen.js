import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Alert, TouchableOpacity, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { TabView, TabBar } from 'react-native-tab-view';
import { Dimensions } from 'react-native';
import { orderService } from '../../services/OrderService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';

const OrderScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [index, setIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const [routes] = useState([
    { key: 'pending', title: 'Chờ xác nhận' },
    { key: 'confirmed', title: 'Đã xác nhận' },
    { key: 'shipping', title: 'Đang giao' },
    { key: 'delivered', title: 'Đã giao' },
    { key: 'return_requested', title: 'Yêu cầu trả' },
    { key: 'return_approved', title: 'Đã chấp nhận' },
    { key: 'return_rejected', title: 'Đã từ chối' },
    { key: 'returned', title: 'Đã trả hàng' },
    { key: 'reviewed', title: 'Đã đánh giá' }, // Add this line
    { key: 'cancelled', title: 'Đã hủy' }
  ]);

  const fetchUserInfo = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        setUserId(userId);
        fetchOrders(userId);
      } else {
        console.log('No userId found');
      }
    } catch (error) {
      console.error('Error getting user info:', error);
    }
  };

  const fetchOrders = async (id) => {
    if (!id) {
      console.log('No user ID provided');
      return;
    }

    try {
      setLoading(true);
      const response = await orderService.getUserOrders(id);
      if (response.status === 200) {
        const sortedOrders = response.data.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    if (!userId) return;
    setRefreshing(true);
    await fetchOrders(userId);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (userId) {
        fetchOrders(userId);
      }
    });

    return unsubscribe;
  }, [navigation, userId]);

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
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipping':
        return 'Đang giao';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const handlePickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('common.error'), t('common.permissionDenied'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImages = result.assets ? result.assets : [result];
        setReturnImages([...returnImages, ...selectedImages]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert(t('common.error'), t('common.imagePickError'));
    }
  };

  const handleRequestReturn = (orderId) => {
    navigation.navigate('ReasonReturn', {
      orderId,
      onReturnComplete: () => {
        fetchOrders(userId);
      }
    });
  };

  const renderOrderItem = ({ item }) => {
    // Kiểm tra nếu đơn hàng đã được đánh giá
    const isReviewed = item.status === 'reviewed';

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('OrderDetail', { order: item })}
        style={[styles.orderCard, { backgroundColor: theme.backgroundColor }]}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={[styles.orderId, { color: theme.textColor }]}>
              {t('order.details.orderId', { id: item._id.slice(-6) })}
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
          <Text style={[styles.orderTotal, { color: theme.textColor }]}>
            {t('order.details.total', { amount: item.finalTotal.toLocaleString('vi-VN') })}
          </Text>
          <Text style={[styles.orderAddress, { color: theme.textColor }]}>
            Địa chỉ: {item.shippingAddress}
          </Text>
          <Text style={[styles.paymentMethod, { color: theme.textColor }]}>
            Phương thức: {item.paymentMethod === 'wallet' ? 'Ví MoMo' : 'Tiền mặt'}
          </Text>
        </View>

        {/* Chỉ hiển thị nút khi đơn hàng đã giao và chưa đánh giá */}
        {(item.status === 'delivered' && !isReviewed) && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={() => {
                // Log toàn bộ dữ liệu đơn hàng để debug
                console.log('Full order:', JSON.stringify(item, null, 2));

                // Kiểm tra xem items có tồn tại không
                if (!item.items || !Array.isArray(item.items) || item.items.length === 0) {
                  console.log('No items found in order');
                  Alert.alert(
                    t('common.error'),
                    t('review.error.noItems')
                  );
                  return;
                }

                // Kiểm tra chi tiết từng item trong đơn hàng
                let hasValidItems = false;
                const reviewItems = [];

                for (const orderItem of item.items) {
                  console.log('Checking item:', JSON.stringify(orderItem, null, 2));

                  // Kiểm tra id_product có tồn tại không
                  if (!orderItem || !orderItem.id_product) {
                    console.log('Item or id_product is missing');
                    continue;
                  }

                  // Xử lý trường hợp id_product là string (ObjectId) hoặc object
                  let productData = {
                    _id: null,
                    title: '',
                    media: []
                  };

                  if (typeof orderItem.id_product === 'string') {
                    // Trường hợp id_product là string (ObjectId)
                    productData._id = orderItem.id_product;
                    hasValidItems = true;
                  } else if (typeof orderItem.id_product === 'object' && orderItem.id_product !== null) {
                    // Trường hợp id_product là object đã được populate
                    if (orderItem.id_product._id) {
                      productData._id = orderItem.id_product._id;
                      productData.title = orderItem.id_product.title || '';
                      productData.media = orderItem.id_product.media || [];
                      hasValidItems = true;
                    }
                  }

                  // Nếu có _id hợp lệ, thêm vào danh sách để đánh giá
                  if (productData._id) {
                    reviewItems.push({
                      ...orderItem,
                      id_product: productData
                    });
                  }
                }

                // Kiểm tra sau khi đã xử lý tất cả items
                if (!hasValidItems || reviewItems.length === 0) {
                  console.log('No valid items found after processing');
                  Alert.alert(
                    t('common.error'),
                    t('review.error.noItems')
                  );
                  return;
                }

                // Nếu có items hợp lệ, chuyển sang màn ReviewOrder
                console.log('Valid items for review:', reviewItems.length);
                navigation.navigate('ReviewOrder', {
                  orderId: item._id,
                  items: reviewItems,
                  onReviewComplete: async () => {
                    // Cập nhật trạng thái đơn hàng sang reviewed
                    try {
                      await orderService.updateOrderStatus(item._id, {
                        status: 'reviewed'
                      });
                      // Refresh lại danh sách đơn hàng
                      fetchOrders(userId);
                    } catch (error) {
                      console.error('Error updating order status:', error);
                    }
                  }
                });
              }}
            >
              <Text style={styles.buttonText}>{t('order.confirmDelivery')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.returnButton]}
              onPress={() => handleRequestReturn(item._id)}
            >
              <Text style={styles.buttonText}>{t('order.requestReturn')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };


  // Add pull-to-refresh functionality
  const renderScene = ({ route }) => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    // Lọc đơn hàng theo trạng thái
    const filteredOrders = route.key === 'reviewed'
      ? orders.filter(order => order.status === 'reviewed')
      : orders.filter(order => order.status === route.key);

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
  orderInfo: {
    marginTop: 8,
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
  paymentMethod: {
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
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
    marginLeft: 8,
  },
  returnButton: {
    backgroundColor: '#FF9800',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: 300,
  },
  reasonInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  imageSection: {
    marginBottom: 15,
    flex: 1,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    marginBottom: 10,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  imagePreview: {
    width: 80,
    height: 80,
    marginRight: 10,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImage: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 2,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  submitButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default OrderScreen;