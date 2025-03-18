import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../../context/ThemeContext';
import { walletService } from '../../../../services/WalletService';
import LoadingOverlay from '../../../../components/LoadingOverlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import * as WebBrowser from 'expo-web-browser';
import { momoService } from '../../../../services/MomoService';
import * as Linking from 'expo-linking';

export default function RechargeScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
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
    // Handle deep linking when returning from MoMo
    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const handleDeepLink = async ({ url }) => {
    const { queryParams } = Linking.parse(url);
    
    if (queryParams.status === 'success') {
      // Refresh wallet data
      try {
        const walletResponse = await walletService.getWallet();
        if (walletResponse.success) {
          Alert.alert(
            t('wallet.recharge.success'),
            t('wallet.recharge.successMessage', {
              amount: parseInt(queryParams.amount).toLocaleString('vi-VN')
            }),
            [{ 
              text: 'OK',
              onPress: () => navigation.navigate('WalletScreen')
            }]
          );
        }
      } catch (error) {
        console.error('Error refreshing wallet:', error);
      }
    } else {
      Alert.alert(
        t('common.error'),
        queryParams.message || t('wallet.recharge.error')
      );
    }
  };

  const handleRecharge = async () => {
    if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
        Alert.alert(t('common.error'), t('wallet.recharge.invalidAmount'));
        return;
    }

    Alert.alert(
        t('wallet.recharge.confirm'),
        t('wallet.recharge.message', { amount: parseInt(amount).toLocaleString('vi-VN') }),
        [
            { text: t('common.cancel'), style: 'cancel' },
            {
                text: t('common.confirm'),
                onPress: async () => {
                    try {
                        setLoading(true);
                        
                        const paymentData = {
                            amount: parseInt(amount),
                            orderId: `RECHARGE_${Date.now()}`,
                            orderInfo: `Nap tien vao vi MoMo - User: ${userId}`,
                            userId: userId
                        };

                        const response = await momoService.createPayment(paymentData);

                        if (response.status === 200) {
                            await WebBrowser.openBrowserAsync(response.data.payUrl);
                        } else {
                            throw new Error(response.message || 'Không thể tạo thanh toán');
                        }
                    } catch (error) {
                        console.error('Recharge error:', error);
                        Alert.alert(t('common.error'), t('wallet.recharge.error'));
                    } finally {
                        setLoading(false);
                    }
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
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>{t('wallet.recharge.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <LoadingOverlay />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.label, { color: theme.textColor }]}>{t('wallet.recharge.amount')}</Text>
          <TextInput
            style={[styles.input, { color: theme.textColor, borderColor: theme.borderColor }]}
            placeholder="Nhập số tiền"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TouchableOpacity 
            style={styles.rechargeButton}
            onPress={handleRecharge}
          >
            <Text style={styles.rechargeButtonText}>{t('wallet.recharge.confirm')}</Text>
          </TouchableOpacity>
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
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  rechargeButton: {
    backgroundColor: '#E53935',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  rechargeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});