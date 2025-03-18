import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import Input from '../../../components/Input';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { forgotPassService } from '../../../services/ForgotPassService';
import { useTranslation } from 'react-i18next';

export default function ChangePassword({ route, navigation }) {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const { email, otp } = route.params;

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }

    try {
      setIsLoading(true);
      const response = await forgotPassService.resetPassword(email, otp, newPassword);

      if (response.status === 200) {
        await forgotPassService.deleteOTP(email); // Delete OTP after successful password reset
        Alert.alert('Thành công', 'Đổi mật khẩu thành công', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('Lỗi', response.message || 'Không thể đổi mật khẩu');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Lỗi', 'Không thể đổi mật khẩu');
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
          {t('auth.forgotPassword.changePassword.title')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Input
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder={t('auth.forgotPassword.changePassword.newPassword')}
          secureTextEntry
        />

        <Input
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={t('auth.forgotPassword.changePassword.confirmPassword')}
          secureTextEntry
        />

        <TouchableOpacity onPress={handleSubmit}
        style={styles.submitButton}>
          <Text>{t('auth.forgotPassword.changePassword.submit')}</Text>
        </TouchableOpacity>
      </View>

      <LoadingOverlay 
        visible={isLoading}
        message={t('auth.forgotPassword.changePassword.processing')}
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
});