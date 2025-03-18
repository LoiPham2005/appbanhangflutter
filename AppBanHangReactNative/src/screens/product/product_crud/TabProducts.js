import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Alert, TouchableOpacity, Modal, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { productService } from '../../../services/productService';
import FloatingAction from './floating_action/FloatingAction';
import LoadingOverlay from '../../../components/LoadingOverlay';

const TabProducts = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState([]); // Add products state
  const [loading, setLoading] = useState(true); // Add loading state
  const [refreshing, setRefreshing] = useState(false); // Add refresh state
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigation = useNavigation();
  const { t } = useTranslation();

  // Lấy dữ liệu sản phẩm khi component được render
  useEffect(() => {
    fetchProducts();
  }, []);

  // Cập nhật danh sách sản phẩm khi màn hình được focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts();
    });

    return unsubscribe;
  }, [navigation]);

  // Hàm lấy danh sách sản phẩm từ API
  const fetchProducts = async () => {
    try {
      const result = await productService.getProducts();
      if (result.success) {
        setProducts(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  //  Làm mới danh sách sản phẩm
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchProducts().finally(() => setRefreshing(false));
  }, []);

  //Xử lý khi nhấn nút "More"
  const handleMorePress = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  // chuyển sang màn xem chi tiết
  const handleViewDetail = () => {
    setIsModalVisible(false);
    navigation.navigate('ProductDetail', { product: selectedItem });
  };

  // chuyển màn Chỉnh sửa sản phẩm
  const handleEdit = () => {
    setIsModalVisible(false);
    navigation.navigate('EditProduct', { product: selectedItem });
  };

  //Xóa sản phẩm
  const handleDelete = () => {
    setIsModalVisible(false);
    Alert.alert(
      t('productManagement.tabProducts.askdelete'),
      t('productManagement.tabProducts.deleteConfirm'),
      [
        {
          text: t('productManagement.product.actions.cancel'),
          style: 'cancel'
        },
        {
          text: t('productManagement.product.actions.delete'),
          onPress: async () => {
            try {
              setIsLoading(true);
              const result = await productService.deleteProduct(selectedItem._id);
              
              if (result.status === 200) {
                setProducts(products.filter(p => p._id !== selectedItem._id));
                Alert.alert(
                  t('common.success'),
                  t('productManagement.tabProducts.deleteSuccess'),
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert(
                  t('common.error'),
                  t('productManagement.tabProducts.deleteError'),
                  [{ text: 'OK' }]
                );
              }
            } catch (error) {
              console.error("Error deleting product:", error);
              Alert.alert(
                t('common.error'),
                t('productManagement.tabProducts.deleteError'),
                [{ text: 'OK' }]
              );
            } finally {
              setIsLoading(false);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  // cách các item hiển thị
  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <View style={styles.productRow}>
        <Image
          // Sửa cách lấy ảnh để phù hợp với cấu trúc media mới
          source={{ 
            uri: item.media && item.media.length > 0 
              ? item.media[0].url 
              : 'https://via.placeholder.com/100' // Ảnh placeholder
          }}
          style={styles.productImage}
          onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
        />
        <View style={styles.productDetails}>
          <Text style={styles.productTitle}>{t('productManagement.product.details.name')}: {item.title}</Text>
          <Text>{t('productManagement.product.details.author')}: {item.publishing_house}</Text>
          <Text>{t('productManagement.product.details.price')}: {item.price}</Text>
          <Text>{t('productManagement.product.details.quantity')}: {item.stock_quantity}</Text>
        </View>
        <TouchableOpacity onPress={() => handleMorePress(item)}>
          <Feather name='more-vertical' size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={() => (
            <Text style={styles.errorText}>{t('productManagement.tabProducts.noProducts')}</Text>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2196F3']} // Android
              tintColor="#2196F3" // iOS
            />
          }
        />
        <FloatingAction />

        {/* Modal cho phép chọn chức năng */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsModalVisible(false)}
          >
            <View style={styles.modalContent}>
            <TouchableOpacity
                style={styles.modalItem}
                onPress={handleViewDetail}
              >
                <Feather name="airplay" size={20} color="#000" />
                <Text style={styles.modalText}>{t('productManagement.product.actions.view')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={handleEdit}
              >
                <Feather name="edit" size={20} color="#000" />
                <Text style={styles.modalText}>{t('productManagement.product.actions.edit')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalItem}
                onPress={handleDelete}
              >
                <Feather name="trash-2" size={20} color="red" />
                <Text style={[styles.modalText, { color: 'red' }]}>{t('productManagement.product.actions.delete')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
      <LoadingOverlay 
        visible={isLoading}
        message={t('productManagement.tabProducts.deleting')}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  productItem: {
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  productRow: {
    flexDirection: 'row', // Chia đôi theo chiều ngang
    alignItems: 'center', // Canh giữa các phần tử theo chiều dọc
  },
  productImage: {
    width: 100, // Chỉnh chiều rộng của ảnh
    height: 100, // Chỉnh chiều cao của ảnh
    marginRight: 10, // Khoảng cách giữa ảnh và thông tin sản phẩm
    backgroundColor: '#ddd', // Thêm màu nền để dễ nhận biết vị trí của Image
    resizeMode: 'cover', // Đảm bảo ảnh được hiển thị đúng tỷ lệ
  },
  productDetails: {
    flex: 1, // Dành toàn bộ không gian còn lại cho thông tin sản phẩm
  },
  productTitle: {
    fontWeight: 'bold', // Làm đậm tiêu đề sản phẩm
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    minWidth: 200,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  modalText: {
    marginLeft: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  }
});

export default TabProducts;
