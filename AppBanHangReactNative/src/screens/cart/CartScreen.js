import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { cartService } from '../../services/CartService';
import { productService } from '../../services/productService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import { Feather } from '@expo/vector-icons';

const CartScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCartItems();

    // Refresh cart when focusing screen
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCartItems();
    });





    return unsubscribe;
  }, []);

  // Add new useEffect for initial total calculation
  useEffect(() => {
    calculateTotal();
  }, [cartItems]); // Recalculate when cartItems changes

  const fetchCartItems = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert(t('common.error'), t('cart.loginRequired'));
        return;
      }

      const response = await cartService.getCart();
      if (response.success) {
        // Lọc ra các item của user hiện tại
        const userCartItems = response.data.filter(item => item.id_user === userId);

        // Lấy thông tin chi tiết của từng sản phẩm
        const itemsWithDetails = await Promise.all(
          userCartItems.map(async (cartItem) => {
            const productResponse = await productService.getProductById(cartItem.id_product);
            return {
              ...cartItem,
              productDetails: productResponse.success ? productResponse.data : null
            };
          })
        );

        setCartItems(itemsWithDetails);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      Alert.alert(t('common.error'), t('cart.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      t('cart.confirmDelete'),
      t('cart.confirmDeleteMessage'),
      [
        {
          text: t('cart.no'),
          style: 'cancel'
        },
        {
          text: t('cart.yes'),
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await cartService.deleteCart(itemId);
              if (result.status === 200) {
                setCartItems(prev => prev.filter(item => item._id !== itemId));
              }
            } catch (error) {
              console.error('Error removing item:', error);
              Alert.alert(t('common.error'), t('cart.deleteError'));
            }
          }
        }
      ]
    );
  };

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const result = await cartService.updateCart(item._id, {
        ...item,
        purchaseQuantity: newQuantity
      });

      if (result.status === 200) {
        setCartItems(prev => prev.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, purchaseQuantity: newQuantity }
            : cartItem
        ));

        // Update total if item is selected
        if (selectedItems[item._id]) {
          calculateTotal();
        }
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert(t('common.error'), t('cart.updateError'));
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      const newSelected = {
        ...prev,
        [itemId]: !prev[itemId]
      };

      // Calculate total based on the updated selections immediately
      const hasSelectedItems = Object.values(newSelected).some(value => value);

      const newTotal = cartItems.reduce((sum, item) => {
        if (!item.productDetails) return sum;

        if (hasSelectedItems) {
          // If there are selected items, only sum those
          if (newSelected[item._id]) {
            return sum + (item.productDetails.price * item.purchaseQuantity);
          }
          return sum;
        } else {
          // If no items are selected, sum all items
          return sum + (item.productDetails.price * item.purchaseQuantity);
        }
      }, 0);

      setTotalPrice(newTotal);
      return newSelected;
    });
  };

  const calculateTotal = () => {
    // Kiểm tra xem có sản phẩm nào được chọn không
    const hasSelectedItems = Object.values(selectedItems).some(value => value);

    const total = cartItems.reduce((sum, item) => {
      if (!item.productDetails) return sum;

      if (hasSelectedItems) {
        // Nếu có sản phẩm được chọn, chỉ tính tổng các sản phẩm được chọn
        if (selectedItems[item._id]) {
          return sum + (item.productDetails.price * item.purchaseQuantity);
        }
        return sum;
      } else {
        // Nếu không có sản phẩm nào được chọn, tính tổng tất cả
        return sum + (item.productDetails.price * item.purchaseQuantity);
      }
    }, 0);

    setTotalPrice(total);
  };

  const CustomCheckbox = ({ value, onValueChange }) => {
    return (
      <TouchableOpacity
        onPress={() => onValueChange(!value)}
        style={[
          styles.checkbox,
          value && styles.checkboxChecked
        ]}
      >
        {value && <Feather name="check" size={16} color="#fff" />}
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => {
    if (!item.productDetails) return null;

    const imageUrl = item.productDetails.media && item.productDetails.media.length > 0
      ? item.productDetails.media[0].url
      : null;

    return (
      <View style={styles.cartItem}>
        <CustomCheckbox
          value={selectedItems[item._id] || false}
          onValueChange={() => toggleItemSelection(item._id)}
        />
        <Image
          source={imageUrl ? { uri: imageUrl } : require('../../../assets/placeholder.png')}
          style={styles.productImage}
          defaultSource={require('../../../assets/placeholder.png')}
        />
        <View style={styles.productInfo}>
          <Text style={[styles.productTitle, { color: theme.textColor }]} numberOfLines={2}>
            {item.productDetails.title}
          </Text>
          <Text style={styles.productAuthor}>{item.productDetails.publishing_house}</Text>
          <Text style={styles.productPrice}>
            {item.productDetails.price?.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
            })}
          </Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item, item.purchaseQuantity - 1)}
            >
              <Feather name="minus" size={20} color="#666" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.purchaseQuantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item, item.purchaseQuantity + 1)}
            >
              <Feather name="plus" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleRemoveItem(item._id)}
        >
          <Feather name="trash-2" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleBuy = () => {
    // Lọc ra các sản phẩm đã được chọn
    const selectedProducts = cartItems.filter(item => selectedItems[item._id]).map(item => ({
      ...item,
      // Sử dụng đúng ID từ productDetails
      id_product: item.productDetails._id, // Thay đổi ở đây
      purchaseQuantity: item.purchaseQuantity,
      price: item.productDetails.price
    }));

    if (selectedProducts.length === 0) {
      Alert.alert(t('common.error'), t('cart.selectItemsToBuy'));
      return;
    }

    navigation.navigate('OrderPayment', {
      selectedItems: selectedProducts,
      totalPrice: totalPrice
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        ListEmptyComponent={() => (
          <Text style={[styles.emptyText, { color: theme.textColor }]}>
            {t('cart.empty')}
          </Text>
        )}
      />
      <View style={styles.totalContainer}>
        <Text style={[styles.totalText, { color: theme.textColor }]}>
          {t('cart.total')}:
        </Text>
        <Text style={styles.totalPrice}>
          {totalPrice.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
          })}
        </Text>
        <TouchableOpacity
          onPress={handleBuy}>
          <Text style={[styles.buttonBuy, { color: 'white' }]}>
            {t('cart.buy')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  productAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 5,
  },
  quantity: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
    color: '#666',
  },
  totalContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E53935',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#E53935',
  },
  buttonBuy: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'green'
  }
});

export default CartScreen;