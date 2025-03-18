import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import Input from '../../../components/Input';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { API_URL } from '../../../services/URL_API';
import { forgotPassService } from '../../../services/ForgotPassService';
import { useTranslation } from 'react-i18next';

export default function EnterOTP({ route, navigation }) {
  const { t } = useTranslation();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const { theme } = useTheme();
  const { email } = route.params;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã OTP 6 số');
      return;
    }

    try {
      setIsLoading(true);
      const response = await forgotPassService.verifyOTP(email, otp);

      if (response.status === 200) {
        navigation.navigate('ChangePassword', { email, otp });
      } else {
        Alert.alert('Lỗi', response.message || 'Mã OTP không đúng');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Lỗi', 'Không thể xác thực mã OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      const response = await forgotPassService.sendOTP(email);

      if (response.status === 200) {
        setTimeLeft(300);
        Alert.alert('Thành công', 'Mã OTP mới đã được gửi');
      } else {
        Alert.alert('Lỗi', 'Không thể gửi lại mã OTP');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Lỗi', 'Không thể gửi lại mã OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          {t('auth.forgotPassword.enterOTP.title')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.description, { color: theme.textColor }]}>
          {t('auth.forgotPassword.enterOTP.description')}
        </Text>

        <Input
          value={otp}
          onChangeText={setOtp}
          placeholder="Nhập mã OTP"
          keyboardType="numeric"
          maxLength={6}
        />

        <Text style={[styles.timer, { color: theme.textColor }]}>
          {t('auth.forgotPassword.enterOTP.timeLeft')}
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </Text>

        {timeLeft === 0 && (
          <TouchableOpacity style={styles.resendButton} onPress={handleResendOTP}>
            <Text>{t('auth.forgotPassword.enterOTP.resend')}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text>{t('auth.forgotPassword.enterOTP.confirm')}</Text>
        </TouchableOpacity>
      </View>

      <LoadingOverlay 
        visible={isLoading}
        message={t('auth.forgotPassword.enterOTP.processing')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 20
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  timer: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    padding: 15,
    alignItems: 'center',
  },
  resendButtonText: {
    color: '#2196F3',
    fontSize: 16,
  },
});