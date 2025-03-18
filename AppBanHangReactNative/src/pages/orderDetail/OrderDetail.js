import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const OrderDetail = ({ route }) => {
  const { t } = useTranslation();
  const { order } = route.params;
  const { theme } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    console.log('Order data:', JSON.stringify(order, null, 2));
  }, [order]);

  useEffect(() => {
    if (order && order.items) {
      console.log('Items in OrderDetail:', JSON.stringify(order.items, null, 2));
      order.items.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          id_product: item.id_product,
          media: item.id_product?.media,
          title: item.id_product?.title
        });
      });
    }
  }, [order]);

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

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          {t('orderDetail.title')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Order ID and Status */}
        <View style={styles.section}>
          <Text style={[styles.orderId, { color: theme.textColor }]}>
            {t('orderDetail.orderId', { id: order._id.slice(-6) })}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
          </View>
        </View>

        {/* Order Date */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.textColor }]}>Thời gian đặt:</Text>
          <Text style={[styles.value, { color: theme.textColor }]}>
            {new Date(order.createdAt).toLocaleString('vi-VN')}
          </Text>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            Thông tin khách hàng
          </Text>
          <View style={styles.customerInfo}>
            <Text style={[styles.value, { color: theme.textColor }]}>
              <Text style={styles.label}>Tên khách hàng: </Text>
              {order.id_user?.username || 'N/A'}
            </Text>
            <Text style={[styles.value, { color: theme.textColor }]}>
              <Text style={styles.label}>Email: </Text>
              {order.id_user?.email || 'N/A'}
            </Text>
            <Text style={[styles.value, { color: theme.textColor }]}>
              <Text style={styles.label}>Địa chỉ giao hàng: </Text>
              {order.shippingAddress}
            </Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            Sản phẩm đặt mua
          </Text>
          {order.items && order.items.map((item, index) => {
            // Log để debug từng item
            console.log(`Rendering item ${index}:`, item);

            return (
              <View key={index} style={styles.orderItem}>
                <Image
                  source={
                    item.id_product &&
                      item.id_product.media &&
                      item.id_product.media.length > 0 &&
                      item.id_product.media[0].url
                      ? { uri: item.id_product.media[0].url }
                      : require('../../../assets/welcome.png')
                  }
                  style={styles.productImage}
                  defaultSource={require('../../../assets/welcome.png')}
                />
                <View style={styles.productInfo}>
                  <Text style={[styles.itemName, { color: theme.textColor }]} numberOfLines={2}>
                    {item.id_product?.title || 'Sản phẩm không còn tồn tại'}
                  </Text>
                  <Text style={[styles.publishingHouse, { color: theme.textColor }]}>
                    {item.id_product?.publishing_house || ''}
                  </Text>
                  <View style={styles.priceQuantityContainer}>
                    <Text style={[styles.itemPrice, { color: theme.textColor }]}>
                      {item.price?.toLocaleString('vi-VN') || '0'}đ
                    </Text>
                    <Text style={[styles.itemQuantity, { color: theme.textColor }]}>
                      x{item.purchaseQuantity || 0}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Payment Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            Thông tin thanh toán
          </Text>
          <View style={styles.paymentRow}>
            <Text style={[styles.label, { color: theme.textColor }]}>Tạm tính:</Text>
            <Text style={[styles.value, { color: theme.textColor }]}>
              {order.totalPrice.toLocaleString('vi-VN')}đ
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={[styles.label, { color: theme.textColor }]}>Phí vận chuyển:</Text>
            <Text style={[styles.value, { color: theme.textColor }]}>
              {order.shippingFee.toLocaleString('vi-VN')}đ
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={[styles.label, { color: theme.textColor }]}>Giảm giá:</Text>
            <Text style={[styles.value, { color: theme.textColor }]}>
              -{order.discount.toLocaleString('vi-VN')}đ
            </Text>
          </View>
          <View style={[styles.paymentRow, styles.totalRow]}>
            <Text style={[styles.totalLabel, { color: theme.textColor }]}>Tổng cộng:</Text>
            <Text style={[styles.totalValue, { color: theme.textColor }]}>
              {order.finalTotal.toLocaleString('vi-VN')}đ
            </Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.textColor }]}>
            Phương thức thanh toán:
          </Text>
          <Text style={[styles.value, { color: theme.textColor }]}>
            {order.paymentMethod === 'wallet' ? 'Ví MoMo' : 'Tiền mặt khi nhận hàng'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 20
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E53935',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E53935',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  publishingHouse: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerInfo: {
    marginTop: 8,
  }
});

export default OrderDetail;