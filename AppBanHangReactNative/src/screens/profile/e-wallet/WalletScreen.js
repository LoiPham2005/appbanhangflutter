import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, FlatList } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../context/ThemeContext';
import { walletService } from '../../../services/WalletService';
import LoadingOverlay from '../../../components/LoadingOverlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export default function WalletScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        setUserId(id);
      } catch (error) {
        console.error('Error getting userId:', error);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchWallet();
    }
  }, [userId]);

  // Thêm useEffect để lắng nghe sự kiện focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (userId) {
        fetchWallet();
      }
    });

    return unsubscribe;
  }, [navigation, userId]);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const response = await walletService.getWallet();
      if (response.success) {
        const userWallet = response.data.find(w => w.userId === userId);
        setWallet(userWallet);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
      Alert.alert('Error', 'Could not fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text style={[styles.transactionDesc, { color: theme.textColor }]}>
          {item.description || t('wallet.transactions.default')}
        </Text>
        <Text style={styles.transactionDate}>
          {new Date(item.timestamp).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        { color: item.type === 'credit' ? '#4CAF50' : '#E53935' }
      ]}>
        {item.type === 'credit' ? '+' : '-'}
        {item.amount.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND'
        })}
      </Text>
    </View>
  );

  // Add sorting for transactions
  const sortedTransactions = useMemo(() => {
    if (!wallet?.transactions) return [];
    return [...wallet.transactions].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [wallet?.transactions]);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>{t('wallet.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <LoadingOverlay />
      ) : (
        <View style={styles.walletContainer}>
          <Image
            source={require('../../../../assets/momo-logo.png')}
            style={styles.walletLogo}
          />
          <Text style={[styles.balanceLabel, { color: theme.textColor }]}>{t('wallet.balance')}</Text>
          <Text style={styles.balanceAmount}>
            {wallet?.balance?.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }) || '0 VND'}
          </Text>

          {/* Thêm nút nạp tiền */}
          <TouchableOpacity
            style={styles.rechargeButton}
            onPress={() => navigation.navigate('RechargeScreen')}
          >
            <Text style={styles.rechargeButtonText}>{t('wallet.recharge.title')}</Text>
          </TouchableOpacity>

          {wallet?.transactions && wallet.transactions.length > 0 && (
            <View style={styles.transactionContainer}>
              <Text style={[styles.transactionTitle, { color: theme.textColor }]}>
                {t('wallet.history')}
              </Text>
              <FlatList
                data={sortedTransactions}
                renderItem={renderTransactionItem}
                keyExtractor={(item) => item.transactionId || item._id}
                showsVerticalScrollIndicator={true}
                style={styles.transactionList}
              />
            </View>
          )}
        </View>
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
  walletContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  walletLogo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 20,
  },
  rechargeButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  rechargeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionContainer: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
    marginVertical: 1,
  },
  transactionDesc: {
    fontSize: 16,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionList: {
    flex: 1,
    width: '100%',
  }
});