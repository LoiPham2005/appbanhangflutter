import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { useTheme } from '../../../context/ThemeContext';
import { API_URL } from '../../../services/URL_API';
import { userService } from '../../../services/UserService';

const EditProfile = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    avatar: null,
    username: '',
    sex: '',
    phone: '',
    birth_date: new Date()
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const userInfoString = await AsyncStorage.getItem('userInfo');

        console.log('UserId:', userId);
        console.log('UserInfo string:', userInfoString);

        if (userInfoString) {
            const userInfo = JSON.parse(userInfoString);
            console.log('Parsed userInfo:', userInfo);

            const userData = {
                avatar: userInfo.avatar || null,
                username: userInfo.username || userInfo.name || '',
                sex: userInfo.sex || '',
                phone: userInfo.phone || '',
                birth_date: userInfo.birth_date ? new Date(userInfo.birth_date) : new Date()
            };

            setUserData(userData);
            console.log('Setting userData:', userData);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Lỗi', 'Không thể tải thông tin người dùng');
    }
};

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('common.error'), t('profile.permissionDenied'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setUserData(prev => ({ ...prev, avatar: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleSave = async () => {
    Alert.alert(
      t('common.confirm'),
      t('profile.editProfile.confirmMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('common.save'),
          onPress: async () => {
            try {
              setIsLoading(true);

              const userId = await AsyncStorage.getItem('userId');
              if (!userId) {
                Alert.alert('Error', 'Please login again');
                return;
              }

              const updateData = {
                username: userData.username,
                sex: userData.sex,
                phone: userData.phone,
                birth_date: userData.birth_date.toISOString(), // Convert date to ISO string
              };

              if (userData.avatar && !userData.avatar.startsWith('http')) {
                const formData = new FormData();
                formData.append('media', {
                  uri: userData.avatar,
                  type: 'image/jpeg',
                  name: 'avatar.jpg'
                });

                const uploadResult = await userService.uploadMedia(formData);
                if (uploadResult.status === 200 && uploadResult.mediaUrls.length > 0) {
                  updateData.avatar = uploadResult.mediaUrls[0].url;
                }
              }

              const result = await userService.updateProfile(userId, updateData);

              if (result.status === 200) {
                // Get existing user info and merge with new data
                const existingUserInfo = JSON.parse(await AsyncStorage.getItem('userInfo') || '{}');
                const newUserInfo = {
                  ...existingUserInfo,
                  name: userData.username,
                  username: userData.username,
                  avatar: updateData.avatar || existingUserInfo.avatar,
                  sex: userData.sex,
                  phone: userData.phone,
                  birth_date: userData.birth_date.toISOString()
                };

                await AsyncStorage.setItem('userInfo', JSON.stringify(newUserInfo));
                console.log('Saved user info:', newUserInfo); // Debug log

                Alert.alert(
                  t('common.success'),
                  t('profile.updateSuccess'),
                  [
                    {
                      text: 'OK',
                      onPress: () => navigation.goBack()
                    }
                  ]
                );
              } else {
                Alert.alert(t('common.error'), t('profile.updateError'));
              }
            } catch (error) {
              console.error('Error updating profile:', error);
              Alert.alert(t('common.error'), t('profile.updateError'));
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.textHeader]}>
        {t('profile.editProfile.title')}
      </Text>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={handleImagePick}>
          <Image
            source={userData.avatar ? { uri: userData.avatar } : require('../../../../assets/placeholder.png')}
            style={styles.avatar}
          />
          <View style={styles.editIconContainer}>
            <Feather name="edit-2" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.textColor }]}>
            {t('profile.username')}
          </Text>
          <TextInput
            style={[styles.input, { color: theme.textColor, borderColor: theme.borderColor }]}
            value={userData.username}
            onChangeText={(text) => setUserData(prev => ({ ...prev, username: text }))}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.textColor }]}>
            {t('profile.sex')}
          </Text>
          <View style={styles.sexContainer}>
            {['male', 'female', 'other'].map((sex) => (
              <TouchableOpacity
                key={sex}
                style={[
                  styles.sexOption,
                  userData.sex === sex && styles.selectedSex
                ]}
                onPress={() => setUserData(prev => ({ ...prev, sex }))}
              >
                <Text style={userData.sex === sex ? styles.selectedSexText : styles.sexText}>
                  {t(`profile.${sex}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.textColor }]}>
            {t('profile.phone')}
          </Text>
          <TextInput
            style={[styles.input, { color: theme.textColor, borderColor: theme.borderColor }]}
            value={userData.phone}
            onChangeText={(text) => setUserData(prev => ({ ...prev, phone: text }))}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.textColor }]}>
            {t('profile.birthDate')}
          </Text>
          <TouchableOpacity
            style={[styles.dateButton, { borderColor: theme.borderColor }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: theme.textColor }}>
              {userData.birth_date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={userData.birth_date}
            mode="date"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setUserData(prev => ({ ...prev, birth_date: selectedDate }));
              }
            }}
          />
        )}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{t('profile.save')}</Text>
      </TouchableOpacity>

      <LoadingOverlay 
        visible={isLoading} 
        message={t('profile.editProfile.saving')} 
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  textHeader:{
    fontSize: 20,
    marginTop: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#E53935',
    padding: 8,
    borderRadius: 20,
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
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
  },
  sexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sexOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedSex: {
    backgroundColor: '#E53935',
    borderColor: '#E53935',
  },
  sexText: {
    color: '#666',
  },
  selectedSexText: {
    color: '#fff',
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  saveButton: {
    backgroundColor: '#E53935',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default EditProfile;