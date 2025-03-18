import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTheme } from '../../../../context/ThemeContext'
import { addressService } from '../../../../services/AddressService'
import LoadingOverlay from '../../../../components/LoadingOverlay'
import { useTranslation } from 'react-i18next';  // Thêm import này

export default function EditAddress() {
  const { t } = useTranslation();  // Thêm hook này
  const navigation = useNavigation()
  const route = useRoute()
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)
  const { address } = route.params

  const [formData, setFormData] = useState({
    fullName: address.fullName,
    phone: address.phone.toString(),
    receivingAddress: address.receivingAddress,
    province: address.province,
    district: address.district,
    commune: address.commune
  })

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.phone || !formData.receivingAddress ||
      !formData.province || !formData.district || !formData.commune) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin')
      return
    }

    Alert.alert(
      'Xác nhận',
      'Bạn có muốn cập nhật địa chỉ này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Cập nhật',
          onPress: async () => {
            try {
              setLoading(true)
              const response = await addressService.updateAddress(address._id, {
                ...formData,
                phone: Number(formData.phone)
              })
              if (response.status === 200) {
                navigation.navigate('AddressScreen', {
                  shouldRefresh: true,
                  returnParams: route.params?.returnParams // Truyền lại returnParams
                });
              } else {
                Alert.alert('Lỗi', 'Không thể cập nhật địa chỉ')
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể cập nhật địa chỉ')
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
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>{t('address.edit.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <LoadingOverlay />
      ) : (
        <ScrollView style={styles.form}>
          <TextInput
            style={[styles.input, { color: theme.textColor }]}
            placeholder={t('address.add.fullName')}
            placeholderTextColor={theme.textColor}
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          />

          <TextInput
            style={[styles.input, { color: theme.textColor }]}
            placeholder={t('address.add.phone')}
            placeholderTextColor={theme.textColor}
            value={formData.phone}
            keyboardType="numeric"
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
            placeholder={t('address.add.detail')}
            placeholderTextColor={theme.textColor}
            value={formData.receivingAddress}
            onChangeText={(text) => setFormData({ ...formData, receivingAddress: text })}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>{t('address.edit.submit')}</Text>
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