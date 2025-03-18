import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { productService } from '../../../services/productService';
import { Feather } from '@expo/vector-icons';

export default function TabInventory() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
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
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'out of stock':
        return '#F44336';
      case 'importing goods':
        return '#2196F3';
      case 'stop selling':
        return '#9E9E9E';
      default:
        return '#000';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return t('inventory.status.active');
      case 'out of stock':
        return t('inventory.status.outOfStock');
      case 'importing goods':
        return t('inventory.status.importing');
      case 'stop selling':
        return t('inventory.status.stopSelling');
      default:
        return status;
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.productCard, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.productHeader}>
        <Text style={[styles.productTitle, { color: theme.textColor }]}>
          {t('product.name')}: {item.title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.productDetails}>
        <Text style={[styles.text, { color: theme.textColor }]}>
          {t('product.author')}: {item.publishing_house}
        </Text>
        <Text style={[styles.text, { color: theme.textColor }]}>
          {t('product.price')}: {item.price.toLocaleString('vi-VN')}đ
        </Text>
        <Text style={[styles.text, { color: theme.textColor }]}>
          {t('product.quantity')}: {item.stock_quantity}
        </Text>
        
        <View style={styles.stockIndicator}>
          <View 
            style={[
              styles.stockBar, 
              { width: `${Math.min((item.stock_quantity / 100) * 100, 100)}%` },
              { backgroundColor: getStatusColor(item.status) }
            ]} 
          />
        </View>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
            tintColor={theme.textColor}
          />
        }
        ListEmptyComponent={() => (
          <Text style={[styles.emptyText, { color: theme.textColor }]}>
            {t('noProducts')}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productDetails: {
    marginTop: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  stockIndicator: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  stockBar: {
    height: '100%',
    borderRadius: 3,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  }
});