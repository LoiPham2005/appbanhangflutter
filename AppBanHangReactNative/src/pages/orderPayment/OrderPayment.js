import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { walletService } from '../../services/WalletService';
import { orderService } from '../../services/OrderService';
import { useNavigation } from '@react-navigation/native';
import { notificationService } from '../../services/NotificationService';
import { API_URL } from '../../services/URL_API';
import { NotificationHelper } from '../../utils/NotificationHelper';

const OrderPayment = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [address, setAddress] = useState('');
  const [totalPrice, setTotalPrice] = useState(route.params?.totalPrice || 0);
  const [selectedItems, setSelectedItems] = useState(route.params?.selectedItems || []);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingFee, setShippingFee] = useState(30000);
  const [discount, setDiscount] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add this line

  // Thêm useEffect để theo dõi thay đổi từ route.params
  useEffect(() => {
    if (route.params?.selectedAddress) {
      setAddress(route.params.selectedAddress);
    }
    if (route.params?.selectedItems) {
      setSelectedItems(route.params.selectedItems);
    }
    if (route.params?.totalPrice) {
      setTotalPrice(route.params.totalPrice);
    }
    if (route.params?.voucher) {
      setSelectedVoucher(route.params.voucher);
      const voucherDiscount = route.params.voucher.discountType === 'percentage'
        ? (route.params.totalPrice * route.params.voucher.discountValue / 100)
        : route.params.voucher.discountValue;
      setDiscount(voucherDiscount);
    }
  }, [route.params]);

  // Add useEffect to fetch wallet balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        setUserId(id);

        if (id) {
          const response = await walletService.getWallet();
          if (response.success) {
            const userWallet = response.data.find(w => w.userId === id);
            setWalletBalance(userWallet?.balance || 0);
          }
        }
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };
    fetchWalletBalance();
  }, []);

  const renderSelectedItems = () => {
    return selectedItems?.map((item, index) => (
      <View key={index} style={styles.itemContainer}>
        <Image
          source={{ uri: item.productDetails.media[0].url }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={[styles.productTitle, { color: theme.textColor }]}>
            {item.productDetails.title}
          </Text>
          <Text style={styles.quantity}>x{item.purchaseQuantity}</Text>
          <Text style={styles.price}>
            {item.productDetails.price.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
            })}
          </Text>
        </View>
      </View>
    ));
  };

  const applyVoucher = () => {
    // Mock voucher logic
    if (voucher === 'DISCOUNT10') {
      setDiscount(totalPrice * 0.1);
    }
  };

  const calculateTotal = () => {
    return totalPrice + shippingFee - discount;
  };

  // Navigate to AddressScreen
  const navigateToAddress = () => {
    navigation.navigate('AddressScreen', {
      isSelecting: true,
      returnParams: {
        totalPrice,
        selectedItems,
        voucher: selectedVoucher
      }
    });
  };

  // Navigate to VoucherScreen
  const navigateToVoucher = () => {
    navigation.navigate('VoucherScreen', {
      isSelecting: true,
      returnParams: {
        totalPrice,
        selectedItems,
        selectedAddress: address
      }
    });
  };

  const orderMessage = async (orderResponse) => {
    try {
      // Get admin ID from the database
      const adminResponse = await fetch(`${API_URL}/api/users/getAdmin`);
      const adminData = await adminResponse.json();
      const adminId = adminData.data._id;

      const notificationData = {
        userId: adminId,
        title: 'Đơn hàng mới',
        message: `Có đơn hàng mới #${orderResponse.data._id.slice(-6)} đã được đặt`,
        type: 'order',
        data: {
          orderId: orderResponse.data._id,
          orderAmount: calculateTotal(),
          createdAt: new Date().toISOString(),
          shippingAddress: address,
          paymentMethod: paymentMethod,
          isAdmin: true // Thêm flag này để đánh dấu thông báo cho admin
        }
      };

      await notificationService.createNotification(notificationData);
      console.log('Notification sent to admin');

      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    if (!address) {
      Alert.alert('Thông báo', 'Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    const finalTotal = calculateTotal(); // Get total from calculateTotal function

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
              const orderData = {
                id_user: userId,
                items: selectedItems.map(item => ({
                  id_product: item.id_product, // Sử dụng id_product đã được chuẩn bị từ CartScreen
                  purchaseQuantity: item.purchaseQuantity,
                  price: parseFloat(item.price)
                })),
                totalPrice: parseFloat(totalPrice),
                shippingFee: parseFloat(shippingFee),
                discount: parseFloat(discount),
                finalTotal: parseFloat(finalTotal),
                paymentMethod: paymentMethod,
                shippingAddress: address,
                voucherId: selectedVoucher?._id
              };

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

  // Thêm hàm createNotification 
  const createNotification = async (userId, title, message, type = 'order') => {
    try {
      const notificationData = {
        userId,
        title,
        message,
        type,
        isRead: false,
        data: {
          createdAt: new Date().toISOString()
        }
      };

      const response = await notificationService.createNotification(notificationData);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    } catch (error) {
      console.error('Error creating notification:', error);
      // Don't throw error here to prevent blocking order completion
      return null;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {/* Title */}
      <Text style={styles.pageTitle}>{t('orderPayment.title')}</Text>

      {/* Delivery Address Section */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={navigateToAddress}
        >
          <View
            style={{ justifyContent: 'space-between', flexDirection: 'row' }}
          >
            <View style={styles.sectionHeader}>
              <Feather name="map-pin" size={20} color={theme.textColor} />
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                {t('orderPayment.address.title')}
              </Text>
            </View>
            <View>
              <Feather name="chevron-right" size={20} color={theme.textColor} />
            </View>
          </View>
          {address ? (
            <Text style={[styles.addressText, { color: theme.textColor }]}>
              {address}
            </Text>
          ) : (
            <Text style={styles.placeholderText}>{t('orderPayment.address.selectAddress')}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Selected Items Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="shopping-bag" size={20} color={theme.textColor} />
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            {t('order.selectedItems')}
          </Text>
        </View>
        {renderSelectedItems()}
      </View>

      {/* Voucher Section */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={navigateToVoucher}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={styles.sectionHeader}>
              <Feather name="tag" size={20} color={theme.textColor} />
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                {t('orderPayment.voucher.title')}
              </Text>
            </View>
            <View>
              <Feather name="chevron-right" size={20} color={theme.textColor} />
            </View>
          </View>
          {selectedVoucher ? (
            <View style={styles.selectedVoucher}>
              <View style={styles.voucherRow}>
                <Text style={[styles.voucherText, { color: theme.textColor }]}>
                  {selectedVoucher.name} - {selectedVoucher.discountValue}
                  {selectedVoucher.discountType === 'percentage' ? '%' : 'VND'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Xác nhận',
                      'Bạn có muốn bỏ voucher này không?',
                      [
                        {
                          text: 'Không',
                          style: 'cancel'
                        },
                        {
                          text: 'Có',
                          onPress: () => {
                            setSelectedVoucher(null);
                            setDiscount(0);
                          }
                        }
                      ]
                    );
                  }}
                >
                  <Feather name="x" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={styles.placeholderText}>{t('order.enterVoucher')}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Payment Method Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="credit-card" size={20} color={theme.textColor} />
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            {t('orderPayment.payment.title')}
          </Text>
        </View>

        {/* COD Option */}
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === 'cod' && styles.selectedPayment
          ]}
          onPress={() => setPaymentMethod('cod')}
        >
          <Feather name="dollar-sign" size={24} color={theme.textColor} />
          <Text style={[styles.paymentText, { color: theme.textColor }]}>
            {t('orderPayment.payment.cod')}
          </Text>
        </TouchableOpacity>

        {/* E-Wallet Option */}
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === 'wallet' && styles.selectedPayment,
            { marginTop: 10 }
          ]}
          onPress={() => setPaymentMethod('wallet')}
        >
          <Feather name="credit-card" size={24} color={theme.textColor} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.paymentText, { color: theme.textColor }]}>
              {t('orderPayment.payment.wallet')}
            </Text>
            {paymentMethod === 'wallet' && (
              <Text style={styles.walletBalance}>
                Số dư: {walletBalance.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                })}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Order Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('orderPayment.summary.subtotal')}</Text>
          <Text style={styles.summaryValue}>
            {totalPrice.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
            })}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('orderPayment.summary.shipping')}</Text>
          <Text style={styles.summaryValue}>
            {shippingFee.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
            })}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('order.discount')}</Text>
          <Text style={[styles.summaryValue, styles.discountValue]}>
            -{discount.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
            })}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>{t('orderPayment.summary.total')}</Text>
          <Text style={styles.totalValue}>
            {calculateTotal().toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
            })}
          </Text>
        </View>
      </View>

      {/* Place Order Button */}
      <TouchableOpacity
        style={styles.placeOrderButton}
        onPress={handlePlaceOrder}
      >
        <Text style={styles.placeOrderText}>{t('orderPayment.placeOrder')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 10,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  quantity: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E53935',
  },
  voucherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voucherInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    backgroundColor: '#f8f8f8',
  },
  applyButton: {
    backgroundColor: '#E53935',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  selectedPayment: {
    borderColor: '#E53935',
    backgroundColor: '#FFF5F5',
  },
  paymentText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  summary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  discountValue: {
    color: '#4CAF50',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E53935',
  },
  placeOrderButton: {
    backgroundColor: '#E53935',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  addressText: {
    fontSize: 14,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  selectedVoucher: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  voucherText: {
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  voucherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletBalance: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginLeft: 36
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1000
  }
});

export default OrderPayment;