import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  FlatList,
  Dimensions,
  RefreshControl,
  Alert // Add this
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Add this import
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { productService } from '../../services/productService';
import { BannerService } from '../../services/BannerService';
import NotificationIcon from '../../pages/notification/NotificationIcon';
import { useNetInfo } from "@react-native-community/netinfo"; // Thay đổi cách import
import NetworkAlert from '../../components/NetworkAlert';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useTheme();
  const [searchText, setSearchText] = React.useState('');
  // const [isEditable, setIsEditable] = React.useState(true);
  const [products, setProducts]= useState([]);
  const [banners, setBanners] = useState([]);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const netInfo = useNetInfo(); // Sử dụng hook useNetInfo
  const [isConnected, setIsConnected] = useState(true);

  const handleNavigate = () => {
    // setIsEditable(false); // Vô hiệu hóa TextInput
    navigation.navigate('Search'); // Chuyển sang màn hình khác
  };

  const handleSearch = () => {
    navigation.navigate('Search');
  };

  useEffect(()=>{
    fetchProducts();
    fetchBanners();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (banners.length > 0) {
        const nextIndex = (currentIndex + 1) % banners.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true
        });
        setCurrentIndex(nextIndex);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [currentIndex, banners]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  // Kiểm tra kết nối mạng
  useEffect(() => {
    if (netInfo.type !== "unknown") {
      setIsConnected(netInfo.isConnected);
      if (!netInfo.isConnected) {
        console.log('Mất kết nối mạng');
      }
    }
  }, [netInfo]);

  // Fetch data khi có kết nối
  useEffect(() => {
    if (isConnected) {
      fetchData();
    }
  }, [isConnected]);

  // lấy danh sách sản phẩm từ API
  const fetchProducts = async ()=>{
    try {
      const respone = await productService.getProducts();
      if(respone.success){
        setProducts(respone.data);
      }else{
        console.error(respone.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  // lấy bannners từ API
  const fetchBanners = async () => {
    try {
      const response = await BannerService.getBanners();
      if (response.success) {
        setBanners(response.data);
      } else {
        console.error("Error fetching banners:", response.message);
        setBanners([]); // Set empty array if error
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      setBanners([]); // Set empty array if error
    }
  };

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchProducts(),
        fetchBanners()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, []);

  const handleChatPress = async () => {
    try {
      const userRole = await AsyncStorage.getItem('userRole');
      console.log('Current userRole:', userRole); // Debug log
      
      if (userRole === 'admin') {
        navigation.navigate('ChatList');
      } else {
        navigation.navigate('Chat');
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      Alert.alert('Lỗi', 'Không thể mở chat');
    }
  };

  // header view
  const headersView = () =>{
    return(
      <View style={[styles.header, { borderBottomColor: isDarkMode ? '#333' : '#f4f4f4' }]}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Feather name="menu" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <TextInput
          style={[styles.searchInput, { color: theme.textColor }]}
          placeholder="Tìm kiếm"
          placeholderTextColor={theme.textColor}
          value={searchText}
          onChangeText={setSearchText}
          onPressIn={handleSearch}
        />
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleChatPress}
          >
            <Feather name="message-circle" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <NotificationIcon navigation={navigation} />
        </View>
      </View>
    );
  }

  // gợi ý các danh mục sản phẩm
  const suggestCategory = () => {
    return(
      <View style={styles.iconContainer}>
      <TouchableOpacity style={styles.iconBox} onPress={handleNavigate}>
        <Feather name="book-open" size={24} color={theme.textColor} />
        <Text style={[styles.iconText, { color: theme.textColor }]}>{t('home.bestsellers')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconBox}>
        <Feather name="tag" size={24} color={theme.textColor} />
        <Text style={[styles.iconText, { color: theme.textColor }]}>{t('home.onSale')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconBox}>
        <Feather name="star" size={24} color={theme.textColor} />
        <Text style={[styles.iconText, { color: theme.textColor }]}>{t('home.goldenDeals')}</Text>
      </TouchableOpacity>
    </View>
    );
  }

  // banner View
  const bannerView = () => {
    // Kiểm tra nếu không có banner
    if (!banners || banners.length === 0) {
      return null;
    }
  
    const renderBannerItem = ({ item }) => {
      // Kiểm tra nếu item hoặc homeBanner không tồn tại
      if (!item || !item.homeBanner || item.homeBanner.length === 0) {
        return null;
      }
  
      return (
        <View style={styles.itemContainer}>
          {item.homeBanner.map((imageUri, index) => (
            <Image
              key={index}
              source={{ 
                uri: imageUri,
                // Thêm headers nếu cần
                headers: {
                  'Cache-Control': 'no-cache'
                }
              }}
              style={styles.bannerImage}
              resizeMode="cover"
              // Thêm defaultSource và onError handler
              defaultSource={require('../../../assets/placeholder.png')}
              onError={(e) => {
                console.log('Error loading banner image:', e.nativeEvent.error);
                // Có thể thêm xử lý khi load ảnh lỗi
              }}
            />
          ))}
        </View>
      );
    };
  
    return (
      <View style={styles.bannerContainer}>
        <FlatList
          ref={flatListRef}
          data={banners}
          renderItem={renderBannerItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            setCurrentIndex(newIndex);
          }}
        />
        {banners.length > 0 && (
          <View style={styles.paginationDots}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { backgroundColor: index === currentIndex ? '#000' : '#888' }
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };
  

  // danh sách tên
  const listText = () =>{
    return(
      <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            {t('home.featured')}
          </Text>
          <TouchableOpacity>
            <Text style={[styles.viewAll, { color: isDarkMode ? '#888' : 'gray' }]}>
              {t('home.viewAll')}
            </Text>
          </TouchableOpacity>
        </View>
    )
  }

  // renderItem cách hiển thị các sản phẩm
  const renderItem = ({ item }) => {
    if (!item) return null; // Return null nếu item undefined
    
    // Kiểm tra xem item.images có tồn tại và có phần tử không
    const imageUrl = item.media && item.media.length > 0 ? item.media[0].url : null;
  
    return (
      <TouchableOpacity 
        style={styles.productBox}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <Image
          source={imageUrl ? { uri: imageUrl } : require('../../../assets/welcome.png')}
          style={styles.productImage}
          defaultSource={require('../../../assets/welcome.png')} // Thêm ảnh placeholder
        />
        <View style={styles.productInfo}>
          <Text 
            style={[styles.productTitle, { color: theme.textColor }]}
            numberOfLines={2}
          >
            {item.title || 'Không có tiêu đề'}
          </Text>
          <Text style={styles.productAuthor}>
            {item.publishing_house || 'Không có tác giả'}
          </Text>
          <Text style={styles.productPrice}>
            {item.price ? item.price.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }) : '0 VND'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // danh sách sản phẩm chiều ngang
  const listProductHorizontal = () => {
    return (
      <View style={styles.productListContainer}>
        <FlatList
          data={products}
          horizontal
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productListContent}
          ListEmptyComponent={() => (
            <Text style={[styles.emptyText, { color: theme.textColor }]}>
              {t('noProducts')}
            </Text>
          )}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {!isConnected ? (
        <NetworkAlert />
      ) : (
        <>
          {/* hiển thị header */}
          {headersView()}

          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#E53935']}
                tintColor={theme.textColor}
              />
            }
          >
            {/* hiển thị gợi ý các danh mục sản phẩm */}
            {suggestCategory()}

            {/* hiển thị banner */}
            {bannerView()}

            {/* hiển thị text danh sách sản phẩm */}
            {listText()}

            {/* danh sách sản phẩm chiều ngang */}
            {listProductHorizontal()}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  iconBox: {
    alignItems: 'center',
  },
  iconText: {
    marginTop: 8,
    fontSize: 12,
  },
  bannerContainer: {
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: width,
    height: 200,
  },
  paginationDots: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#888',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAll: {
    color: 'gray',
  },

  productBox: {
    width: 160,
    marginHorizontal: 8,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  productImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: 'cover',
  },

  productInfo: {
    padding: 10,
  },

  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  productAuthor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },

  productPrice: {
    fontSize: 14,
    color: '#e53935',
    fontWeight: 'bold',
    marginBottom: 4,
  },

  productStatus: {
    fontSize: 12,
    fontWeight: '500',
  },

  productListContainer: {
    marginTop: 10,
  },
  
  productListContent: {
    paddingHorizontal: 8,
  },
  
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row', // Nếu muốn ảnh xếp hàng ngang
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 15,
    padding: 5,
  },
  
});

export default HomeScreen;
