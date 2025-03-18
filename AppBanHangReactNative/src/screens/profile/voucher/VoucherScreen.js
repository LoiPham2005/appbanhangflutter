// src/screens/profile/voucher/VoucherScreen.js
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native'; // Thêm useRoute
import { useTheme } from '../../../context/ThemeContext';
import { voucherService } from '../../../services/VoucherService';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { useTranslation } from 'react-i18next';

export default function VoucherScreen() {
  const navigation = useNavigation();
  const route = useRoute(); // Thêm dòng này
  const { theme } = useTheme();
  const { t } = useTranslation(); // Add this line
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await voucherService.getVoucher();
      if (response.success) {
        setVouchers(response.data);
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      Alert.alert('Error', 'Could not fetch vouchers');
    } finally {
      setLoading(false);
    }
  };

  const renderVoucherItem = ({ item }) => (
    <View style={[styles.voucherItem, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.voucherInfo}>
        <Text style={[styles.voucherName, { color: theme.textColor }]}>{item.name}</Text>
        <Text style={[styles.voucherCode, { color: theme.textColor }]}>Code: {item.code}</Text>
        <Text style={[styles.voucherValue, { color: theme.textColor }]}>
          Discount: {item.discountValue}{item.discountType === 'percentage' ? '%' : ' VND'}
        </Text>
        <Text style={[styles.voucherDate, { color: theme.textColor }]}>
          Valid: {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
        </Text>
        <Text style={[styles.quantity, { color: theme.textColor }]}>
          Remaining: {item.quantity}
        </Text>
        {item.condition && (
          <Text style={[styles.voucherCondition, { color: theme.textColor }]}>{item.condition}</Text>
        )}
      </View>
      <TouchableOpacity
        style={[styles.useButton, { opacity: item.quantity > 0 ? 1 : 0.5 }]}
        onPress={() => handleUseVoucher(item)}
        disabled={item.quantity <= 0}>
        <Text style={styles.useButtonText}>Use</Text>
      </TouchableOpacity>
    </View>
  );

  const handleUseVoucher = (voucher) => {
    const now = new Date();
    const endDate = new Date(voucher.endDate);

    if (now > endDate) {
      Alert.alert('Error', 'This voucher has expired');
      return;
    }

    if (voucher.quantity <= 0) {
      Alert.alert('Error', 'This voucher is out of stock');
      return;
    }

    Alert.alert(
      'Use Voucher',
      `Apply ${voucher.discountValue}${voucher.discountType === 'percentage' ? '%' : 'VND'} discount?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Use',
          onPress: () => {
            const returnParams = route.params?.returnParams || {};
            navigation.navigate('OrderPayment', {
              voucher,
              ...returnParams
            });
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>{t('voucher.availableVouchers')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <LoadingOverlay />
      ) : (
        <FlatList
          data={vouchers}
          renderItem={renderVoucherItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <Text style={[styles.emptyText, { color: theme.textColor }]}>
              No vouchers available
            </Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  voucherItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  voucherInfo: {
    flex: 1,
  },
  voucherName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  voucherCode: {
    fontSize: 14,
    marginBottom: 4,
  },
  voucherValue: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 4,
  },
  voucherDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  voucherCondition: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  useButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
  },
  useButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  quantity: {
    fontSize: 12,
    marginBottom: 4,
  },
  voucherDate: {
    fontSize: 12,
    marginBottom: 4,
  },
  voucherCondition: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  }
});