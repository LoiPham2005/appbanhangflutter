import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Input from '../../../components/Input';
import LoadingOverlay from '../../../components/LoadingOverlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../../../services/UserService';

export default function ChangePass() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChangePassword = async () => {
    // Validate inputs
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      Alert.alert(t('common.error'), t('validation.required'));
      return;
    }

    if (formData.newPassword.length < 6) {
      Alert.alert(t('common.error'), t('validation.passwordLength'));
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert(t('common.error'), t('validation.passwordMismatch'));
      return;
    }

    Alert.alert(
      t('settings.changePassword'),
      t('profile.editProfile.confirmMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('common.confirm'),
          onPress: async () => {
            try {
              setIsLoading(true);
              const userId = await AsyncStorage.getItem('userId');
              
              if (!userId) {
                Alert.alert(t('common.error'), t('auth.login.loginRequired'));
                return;
              }

              const response = await userService.changePassword(userId, {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
              });

              if (response.status === 200) {
                Alert.alert(
                  t('common.success'),
                  t('auth.forgotPassword.changePassword.success'),
                  [
                    {
                      text: 'OK',
                      onPress: () => navigation.goBack()
                    }
                  ]
                );
              } else {
                Alert.alert(t('common.error'), response.message || t('auth.forgotPassword.changePassword.error'));
              }
            } catch (error) {
              console.error('Change password error:', error);
              Alert.alert(t('common.error'), t('auth.forgotPassword.changePassword.error'));
            } finally {
              setIsLoading(false);
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
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          {t('settings.changePassword')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Input
          secureTextEntry
          placeholder={t('auth.login.password')}
          value={formData.oldPassword}
          onChangeText={(text) => setFormData({...formData, oldPassword: text})}
        />

        <Input
          secureTextEntry
          placeholder={t('auth.forgotPassword.changePassword.newPassword')}
          value={formData.newPassword}
          onChangeText={(text) => setFormData({...formData, newPassword: text})}
        />

        <Input
          secureTextEntry
          placeholder={t('auth.forgotPassword.changePassword.confirmPassword')}
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
        />

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleChangePassword}
        >
          <Text style={styles.submitButtonText}>
            {t('auth.forgotPassword.changePassword.submit')}
          </Text>
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
    marginTop: 30
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  content: {
    padding: 16
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});