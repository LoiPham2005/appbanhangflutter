import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Dimensions, TouchableOpacity, Alert, Button, Platform } from 'react-native';
import { Video } from 'expo-av';
import { useTranslation } from 'react-i18next';
import { categoryService } from '../../services/CategoryService'; // Adjust the import path as needed
import { Feather } from '@expo/vector-icons';
import { cartService } from '../../services/CartService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingOverlay from '../../components/LoadingOverlay';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { product } = route.params;
  const [categoryName, setCategoryName] = useState('');
  const [status, setStatus] = useState({});
  const videoRef = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategoryName();
  }, []);

  const fetchCategoryName = async () => {
    try {
      if (product.id_category) {
        const result = await categoryService.getCategoryById(product.id_category);
        if (result.success && result.data) {
          setCategoryName(result.data.name);
        }
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      setCategoryName(t('categoryNotFound'));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const renderStatusBadge = (status) => {
    const statusStyles = {
      'active': { backgroundColor: '#4CAF50' },
      'out of stock': { backgroundColor: '#f44336' },
      'importing goods': { backgroundColor: '#2196F3' },
      'stop selling': { backgroundColor: '#9E9E9E' }
    };

    return (
      <View style={[styles.statusBadge, statusStyles[status] || {}]}>
        <Text style={styles.statusText}>{t(status)}</Text>
      </View>
    );
  };

  const renderMedia = (media) => {
    if (media.type === 'video') {
      return (
        <View style={styles.videoWrapper}>
          <Video
            ref={videoRef}
            style={styles.video}
            source={{ uri: media.url }}
            useNativeControls
            resizeMode="contain"
            isLooping
            onPlaybackStatusUpdate={setStatus}
            onError={(error) => {
              console.error('Video error:', error);
              Alert.alert(
                t('common.error'),
                t('productDetail.videoPlaybackError')
              );
            }}
          />
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              if (status.isPlaying) {
                videoRef.current?.pauseAsync();
              } else {
                videoRef.current?.playAsync();
              }
            }}
          >
            <Feather
              name={status.isPlaying ? "pause" : "play"}
              size={30}
              color="white"
            />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <Image
          source={{ uri: media.url }}
          style={styles.productImage}
          resizeMode="cover"
        />
      );
    }
  };

  const handleAddToCart = async () => {
    // Kiểm tra trạng thái sản phẩm trước
    if (product.status !== 'active') {
      Alert.alert(
        t('common.error'),
        t('cart.productNotAvailable')
      );
      return;
    }
  
    Alert.alert(
      t('productDetail.confirm'),
      t('productDetail.askCart'),
      [
        {
          text: t('cart.no'),
          style: 'cancel',
        },
        {
          text: t('cart.yes'),
          onPress: async () => {
            try {
              setIsLoading(true);
              const cartData = {
                id_product: product._id,
                purchaseQuantity: 1
              };
  
              const result = await cartService.addToCart(cartData);
  
              if (result.status === 200) {
                Alert.alert(
                  t('common.success'),
                  t('cart.addSuccess'),
                  [
                    {
                      text: t('cart.continueShopping'),
                      style: 'cancel',
                    },
                    {
                      text: t('cart.viewCart'),
                      onPress: () => navigation.navigate('Cart')
                    }
                  ]
                );
              } else {
                Alert.alert(t('common.error'), result.message);
              }
            } catch (error) {
              console.error('Add to cart error:', error);
              Alert.alert(
                t('common.error'),
                error.message === 'User not logged in' 
                  ? t('cart.loginRequired')
                  : t('cart.addError')
              );
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        {/* Media Carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageCarousel}
        >
          {product.media && product.media.map((media, index) => (
            <View key={index} style={styles.mediaContainer}>
              {renderMedia(media)}
            </View>
          ))}
        </ScrollView>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{product.title}</Text>
          {renderStatusBadge(product.status)}

          <Text style={styles.price}>{formatPrice(product.price)}</Text>

          <View style={styles.detailRow}>
            <Text style={styles.label}>{t('productDetail.author')}:</Text>
            <Text style={styles.value}>{product.publishing_house}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>{t('productDetail.quantity')}:</Text>
            <Text style={styles.value}>{product.stock_quantity}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>{t('productDetail.category')}:</Text>
            <Text style={styles.value}>{categoryName || t('loading')}</Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>{t('productDetail.description')}</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>
        
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.addToCartButton,
            product.status !== 'active' && styles.disabledButton
          ]}
          onPress={handleAddToCart}
          disabled={product.status !== 'active'}
        >
          <Text style={styles.addToCartText}>
            {product.status === 'active' 
              ? t('productDetail.addToCart') 
              : t(`productDetail.status.${product.status}`)}
          </Text>
        </TouchableOpacity>
      </View>

      <LoadingOverlay visible={isLoading} message={t('cart.adding')} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 60, // Add space for fixed button
  },
  imageCarousel: {
    height: Dimensions.get('window').width * 0.8,
  },
  productImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * 0.8,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    color: '#E53935',
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
  },
  label: {
    width: 100,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  descriptionContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  mediaContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15, // Safe area padding
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addToCartButton: {
    backgroundColor: '#E53935',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  }
});

export default ProductDetailsScreen;