import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        console.log('Raw userInfo:', userInfo); // Debug log
        setUserData({
          username: userInfo.name || userInfo.username, // Try both name and username
          email: userInfo.email,
          avatar: userInfo.avatar
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Add useEffect to listen for navigation focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserData();
    });
    return unsubscribe;
  }, [navigation]);

  // Initial data fetch
  useEffect(() => {
    fetchUserData();
  }, []);

  const menuItems = [
    // {
    //   icon: 'map-pin',
    //   title: t('profile.address1'),
    //   onPress: () => navigation.navigate('AddressScreen')
    // },
    {
      icon: 'credit-card',
      title: t('profile.paymentMethod'),
      onPress: () => navigation.navigate('WalletScreen')
    },
    // {
    //   icon: 'tag',
    //   title: t('profile.voucher'),
    //   onPress: () => navigation.navigate('VoucherScreen')
    // },
    {
      icon: 'heart',
      title: t('profile.wishlist'),
      onPress: () => {}
    },
    {
      icon: 'star',
      title: t('profile.appReviews'),
      onPress: () => {}
    }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <Image
          source={userData?.avatar ? { uri: userData.avatar } : require('../../../assets/placeholder.png')}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.textColor }]}>
            {userData?.username || 'User Name'}
          </Text>
          <Text style={styles.userEmail}>
            {userData?.email || 'email@example.com'}
          </Text>
        </View>

        <View>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Feather name="edit" size={24} color={theme.textColor} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { borderBottomColor: theme.borderColor }]}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Feather name={item.icon} size={24} color={theme.textColor} />
              <Text style={[styles.menuItemText, { color: theme.textColor }]}>
                {item.title}
              </Text>
            </View>
            <Feather name="chevron-right" size={24} color={theme.textColor} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    paddingHorizontal: 20,
    borderWidth: 1,
    // borderColor: '#ddd',
    borderRadius: 15,
    shadowRadius: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
  }
});

export default ProfileScreen;