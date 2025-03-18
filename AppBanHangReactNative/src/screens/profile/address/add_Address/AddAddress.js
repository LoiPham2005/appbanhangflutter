import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTheme } from '../../../../context/ThemeContext'
import { Picker } from '@react-native-picker/picker'
import { addressService } from '../../../../services/AddressService'
import LoadingOverlay from '../../../../components/LoadingOverlay'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTranslation } from 'react-i18next';

export default function AddAddress() {
  const navigation = useNavigation()
  const route = useRoute();
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation(); // Add this line

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    receivingAddress: '',
    province: '',
    district: '',
    commune: '',
  });

  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        console.log('Retrieved userId:', id); // Debug log
        if (id) {
          setUserId(id);
        } else {
          console.log('No userId found in AsyncStorage');
          Alert.alert('Lỗi', 'Vui lòng đăng nhập lại');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error getting userId:', error);
        Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng');
      }
    };
    getUserId();
  }, []);

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert('Thông báo', 'Vui lòng đăng nhập lại');
      return;
    }
    if (!formData.fullName || !formData.phone || !formData.receivingAddress ||
      !formData.province || !formData.district || !formData.commune) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin hoặc đăng nhập lại')
      return
    }

    Alert.alert(
      'Xác nhận',
      'Bạn có muốn thêm địa chỉ này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Thêm',
          onPress: async () => {
            try {
              setLoading(true)
              const response = await addressService.addAddress({
                ...formData,
                phone: Number(formData.phone),
                id_user: userId
              })
              if (response.status === 200) {
                navigation.navigate('AddressScreen', {
                  shouldRefresh: true,
                  returnParams: route.params?.returnParams // Truyền lại returnParams
                });
              } else {
                Alert.alert('Lỗi', 'Không thể thêm địa chỉ')
              }
            } catch (error) {
              console.error('Add address error:', error)
              Alert.alert('Lỗi', 'Không thể thêm địa chỉ')
            } finally {
              setLoading(false)
            }
          }
        }
      ]
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          {t('address.add.title')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <LoadingOverlay />
      ) : (
        <ScrollView style={styles.form}>
          <TextInput
            style={[styles.input, { color: theme.textColor }]}
            placeholder="Họ và tên"
            placeholderTextColor={theme.textColor}
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          />

          <TextInput
            style={[styles.input, { color: theme.textColor }]}
            placeholder="Số điện thoại"
            placeholderTextColor={theme.textColor}
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
          />

          <TextInput
            style={[styles.input, { color: theme.textColor }]}
            placeholder={t('address.add.selectProvince')}
            placeholderTextColor={theme.textColor}
            value={formData.province}
            onChangeText={(text) => setFormData({ ...formData, province: text })}
          />

          <TextInput
            style={[styles.input, { color: theme.textColor }]}
            placeholder={t('address.add.selectDistrict')}
            placeholderTextColor={theme.textColor}
            value={formData.district}
            onChangeText={(text) => setFormData({ ...formData, district: text })}
          />

          <TextInput
            style={[styles.input, { color: theme.textColor }]}
            placeholder={t('address.add.selectWard')}
            placeholderTextColor={theme.textColor}
            value={formData.commune}
            onChangeText={(text) => setFormData({ ...formData, commune: text })}
          />

          <TextInput
            style={[styles.input, { color: theme.textColor }]}
            placeholder="Địa chỉ cụ thể"
            placeholderTextColor={theme.textColor}
            value={formData.receivingAddress}
            onChangeText={(text) => setFormData({ ...formData, receivingAddress: text })}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Thêm địa chỉ</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  )
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
  form: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})