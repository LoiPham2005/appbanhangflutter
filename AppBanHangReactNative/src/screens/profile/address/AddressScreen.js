import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTheme } from '../../../context/ThemeContext'
import { addressService } from '../../../services/AddressService'
import LoadingOverlay from '../../../components/LoadingOverlay'
import EditAddress from './edit_address/EditAddress'
import { useTranslation } from 'react-i18next'
// Thêm import AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function AddressScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation()
  const route = useRoute(); // Thêm dòng này
  const { theme } = useTheme()
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      fetchAddresses();
    }
  }, [userId]);

  useEffect(() => {
    fetchAddresses()

    // Refresh list when returning from AddEditAddress
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAddresses()
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Kiểm tra params có shouldRefresh không
      const shouldRefresh = route.params?.shouldRefresh;
      if (shouldRefresh && userId) {
        fetchAddresses();
        // Reset param
        navigation.setParams({ shouldRefresh: false });
      }
    });

    return unsubscribe;
  }, [navigation, route.params?.shouldRefresh, userId]);

  const fetchAddresses = async () => {
    if (!userId) return;

    try {
      setLoading(true)
      const response = await addressService.getAddress(userId)
      if (response.success) {
        setAddresses(response.data)
      }
    } catch (error) {
      console.error("Error fetching addresses:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderItem = ({ item }) => (
    <View style={[styles.addressCard, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.addressContent}>
        <View style={styles.addressInfo}>
          <Text style={[styles.name, { color: theme.textColor }]}>{item.fullName}</Text>
          <Text style={[styles.address, { color: theme.textColor }]}>
            {`${item.receivingAddress}, ${item.commune}, ${item.district}, ${item.province}`}
          </Text>
          <Text style={[styles.phone, { color: theme.textColor }]}>{item.phone}</Text>
          <TouchableOpacity
            style={styles.useButton}
            onPress={() => handleUseAddress(item)}
          >
            <Text style={styles.useButtonText}>Sử dụng</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => handleMorePress(item)}>
          <Feather name="more-vertical" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>
      {item.chooseDefault && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultText}>Mặc định</Text>
        </View>
      )}
    </View>
  );

  const handleMorePress = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleSetDefault = () => {
    setIsModalVisible(false);
    Alert.alert(
      t('common.confirm'),
      t('address.setDefault.confirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('common.confirm'),
          onPress: async () => {
            try {
              setLoading(true);
              const updatedAddress = {
                ...selectedItem,
                chooseDefault: true
              };
              const response = await addressService.updateAddress(selectedItem._id, updatedAddress);
              if (response.status === 200) {
                fetchAddresses(); // Refresh list
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể cập nhật địa chỉ mặc định');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleEdit = () => {
    setIsModalVisible(false);
    navigation.navigate('EditAddress', {
      address: selectedItem,
      isEditing: true,
      returnParams: route.params?.returnParams // Truyền params cho màn sửa địa chỉ
    });
  };

  const handleDelete = () => {
    setIsModalVisible(false);
    Alert.alert(
      t('address.delete.title'),
      t('address.delete.message'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('address.delete.confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await addressService.deleteAddress(selectedItem._id);
              if (response.status === 200) {
                Alert.alert('Thành công', 'Xóa địa chỉ thành công');
                fetchAddresses(); // Refresh list
              }
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Lỗi', 'Không thể xóa địa chỉ');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleUseAddress = (address) => {
    const returnParams = route.params?.returnParams;
    const fullAddress = `${address.fullName}, ${address.phone}, ${address.receivingAddress}, ${address.commune}, ${address.district}, ${address.province}`;

    navigation.navigate('OrderPayment', {
      selectedAddress: fullAddress,
      selectedItems: returnParams?.selectedItems || [], // Truyền lại danh sách sản phẩm 
      totalPrice: returnParams?.totalPrice || 0, // Truyền lại tổng tiền
      voucher: returnParams?.voucher // Truyền lại voucher nếu có
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>{t('address.title')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddAddress', {
          returnParams: route.params?.returnParams // Truyền params cho màn thêm địa chỉ
        })}>
          <Feather name="plus" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>

      {/* Address List */}
      {loading ? (
        <LoadingOverlay />
      ) : (
        <FlatList
          data={addresses}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Modal Options */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={handleEdit}
            >
              <Feather name="edit" size={20} color="#000" />
              <Text style={styles.modalText}>Sửa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalItem}
              onPress={handleDelete}
            >
              <Feather name="trash-2" size={20} color="red" />
              <Text style={[styles.modalText, { color: 'red' }]}>{t('address.delete.title')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  listContainer: {
    padding: 16,
  },
  addressCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
  },
  defaultBadge: {
    position: 'absolute',
    top: 8,
    right: 50,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    color: 'white',
    fontSize: 12,
  },
  addressContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addressInfo: {
    flex: 1,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    minWidth: 200,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  modalText: {
    marginLeft: 10,
    fontSize: 16,
  },
  useButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  useButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
})