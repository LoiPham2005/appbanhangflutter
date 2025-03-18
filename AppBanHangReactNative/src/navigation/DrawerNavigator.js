import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Feather from '@expo/vector-icons/Feather';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import HomeScreen from '../screens/home/HomeScreen';
import CartScreen from '../screens/cart/CartScreen';
import OrderScreen from '../screens/order/OrderScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import TabNavigator from './TabNavigator';
import AccountScreen from '../screens/account/AccountScreen';
import ProductScreen from '../screens/product/ProductScreen';
import StatisticsScreen from '../screens/RevenueStatistics/StatisticsScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import SupportScreen from '../screens/support/SupportScreen';
import AboutUsScreen from '../screens/about/AboutUsScreen';
import LogoutScreen from '../screens/login/LoginScreen';
import { useTheme } from '../context/ThemeContext';
import OrderManagerScreen from '../screens/orderMana/OrderManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const { isDarkMode, setIsDarkMode, theme } = useTheme();
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    avatar: null,
    role: 'user' // Add role
  });

  const fetchUserInfo = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString) {
        const info = JSON.parse(userInfoString);
        console.log('DrawerNavigator userInfo:', info); // Debug log
        setUserInfo({
          name: info.name,
          email: info.email,
          avatar: info.avatar,
          role: info.role || 'user' // Get role from storage
        });
      }
    } catch (error) {
      console.error('Error getting user info:', error);
    }
  };

  // Add focus listener
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', fetchUserInfo);
    return unsubscribe;
  }, [props.navigation]);

  // Initial fetch
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      t('drawer.logout'),  // "Đăng xuất"
      t('drawer.logoutConfirmMessage'), // Add this to translations: "Bạn có chắc chắn muốn đăng xuất?"
      [
        {
          text: t('common.cancel'), // "Hủy"
          style: 'cancel'
        },
        {
          text: t('logout'), // "Đăng xuất"
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              props.navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert(t('common.error'), t('logoutError')); // Add to translations: "Có lỗi xảy ra khi đăng xuất"
            }
          }
        }
      ]
    );
  };

  // Common menu items for all users
  const commonMenuItems = () => (
    <>
      <DrawerItem
        label={t('drawer.home')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="home" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('Home')}
      />
      <DrawerItem
        label={t('drawer.profile')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="user" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('Profile')}
      />
    </>
  );

  // Menu items for normal users
  const userMenuItems = () => (
    <>
     <DrawerItem
        label={t('drawer.cart')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="shopping-cart" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('Cart')}
      />
      <DrawerItem
        label={t('drawer.orders')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="list" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('Order')}
      />
    </>
  );

  // Menu items for admin users
  const adminMenuItems = () => (
    <>
      <DrawerItem
        label={t('drawer.orderManagement')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="list" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('OrderMana')}
      />
      <DrawerItem
        label={t('drawer.accountManagement')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="users" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('Account')}
      />
      <DrawerItem
        label={t('drawer.productManagement')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="box" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('Product')}
      />
      <DrawerItem
        label={t('drawer.statistics')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="bar-chart-2" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('Statistics')}
      />
    </>
  );

  // Settings items common to all users
  const settingsItems = () => (
    <>
      <DrawerItem
        label={t('drawer.settings')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="settings" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('Settings')}
      />
      <DrawerItem
        label={t('drawer.support')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="help-circle" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('Support')}
      />
      <DrawerItem
        label={t('drawer.aboutUs')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="info" size={size} color={theme.textColor} />}
        onPress={() => props.navigation.navigate('AboutUs')}
      />
    </>
  );

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <View style={[styles.headerContainer, { backgroundColor: isDarkMode ? '#333' : '#f6f6f6' }]}>
        {userInfo.avatar ? (
          <Image
            source={{ uri: userInfo.avatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: isDarkMode ? '#444' : '#ddd' }]}>
            <Feather name="user" size={30} color={isDarkMode ? '#666' : '#999'} />
          </View>
        )}
        <Text style={[styles.name, { color: theme.textColor }]}>{userInfo.name || 'User'}</Text>
        <Text style={[styles.email, { color: isDarkMode ? '#ccc' : 'gray' }]}>{userInfo.email || 'email@example.com'}</Text>
      </View>

      {/* hiển thị toàn bộ list nhanh nhất nhưng muốn custom thì không dùng được */}
      {/* <DrawerItemList {...props} /> */}

      {/* Common Menu Items */}
      {commonMenuItems()}

      {/* Role-based Menu Items */}
      {userInfo.role === 'admin' ? adminMenuItems() : userMenuItems()}

      {/* Section divider */}
      <View style={[styles.sectionDivider, { backgroundColor: isDarkMode ? '#333' : '#f6f6f6' }]}>
        <Text style={[styles.sectionText, { color: theme.textColor }]}>{t('drawer.other')}</Text>
      </View>

      {/* Common Settings Items */}
      {settingsItems()}

      {/* Section divider */}
      <View style={[styles.sectionDivider, { backgroundColor: isDarkMode ? '#333' : '#f6f6f6' }]}>
        <Text style={[styles.sectionText, { color: theme.textColor }]}>{t('drawer.exit')}</Text>
      </View>

      <DrawerItem
        label={t('drawer.logout')}
        labelStyle={{ color: theme.textColor }}
        icon={({ size }) => <Feather name="log-out" size={size} color={theme.textColor} />}
        onPress={handleLogout} // Use the new handleLogout function
      />

    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  const { t } = useTranslation();
  const { theme, isDarkMode } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.backgroundColor,
        },
        headerTintColor: theme.textColor,
        drawerActiveBackgroundColor: isDarkMode ? '#333' : '#f4f5f6',
        drawerActiveTintColor: theme.textColor,
        drawerInactiveTintColor: theme.textColor,
        drawerStyle: {
          backgroundColor: theme.backgroundColor,
        }
      }}
    >
      <Drawer.Screen
        // thêm bottom tabs
        // name="MainTabs" 
        // component={TabNavigator}
        // không có bottom tabs
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          title: t('drawer.home'),
          drawerLabel: t('drawer.home'),
          drawerIcon: () => <Feather name="home" size={24} color="black" />
        }}
      />
      <Drawer.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: t('drawer.cart'),
          drawerLabel: t('drawer.cart'),
          drawerIcon: () => <Feather name="shopping-cart" size={24} color="black" />
        }}
      />
      <Drawer.Screen
        name="Order"
        component={OrderScreen}
        options={{
          title: t('drawer.orders'),
          drawerLabel: t('drawer.orders'),
          drawerIcon: () => <Feather name="file-text" size={24} color={theme.textColor} />
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t('drawer.profile'),
          drawerLabel: t('drawer.profile'),
          drawerIcon: () => <Feather name="user" size={24} color={theme.textColor} />
        }}
      />
      <Drawer.Screen
        name="OrderMana"
        component={OrderManagerScreen}
        options={{
          title: t('drawer.orderManagement'),
          drawerLabel: t('drawer.orderManagement'),
          drawerIcon: () => <Feather name="user" size={24} color={theme.textColor} />
        }}
      />
      <Drawer.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: t('drawer.accountManagement'),
          drawerLabel: t('drawer.accountManagement'),
          drawerIcon: () => <Feather name="user" size={24} color="black" />
        }}
      />
      <Drawer.Screen
        name="Product"
        component={ProductScreen}
        options={{
          title: t('drawer.productManagement'),
          drawerLabel: t('drawer.productManagement'),
          drawerIcon: () => <Feather name="box" size={24} color="black" />
        }}
      />
      <Drawer.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          title: t('drawer.statistics'),
          drawerLabel: t('drawer.statistics'),
          drawerIcon: () => <Feather name="bar-chart-2" size={24} color="black" />
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: t('drawer.settings'),
          drawerLabel: t('drawer.settings'),
          drawerIcon: () => <Feather name="settings" size={24} color="black" />
        }}
      />
      <Drawer.Screen
        name="Support"
        component={SupportScreen}
        options={{
          title: t('drawer.support'),
          drawerLabel: t('drawer.support'),
          drawerIcon: () => <Feather name="help-circle" size={24} color="black" />
        }}
      />
      <Drawer.Screen
        name="AboutUs"
        component={AboutUsScreen}
        options={{
          title: t('drawer.aboutUs'),
          drawerLabel: t('drawer.aboutUs'),
          drawerIcon: () => <Feather name="info" size={24} color="black" />
        }}
      />
      <Drawer.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          title: t('drawer.logout'),
          drawerLabel: t('drawer.logout'),
          drawerIcon: () => <Feather name="log-out" size={24} color="black" />,
          onPress: () => {
            navigation.navigate('Login');
          }
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    backgroundColor: '#f6f6f6',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  email: {
    fontSize: 14,
    color: 'gray',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f6f6f6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionDivider: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 8,
    backgroundColor: '#f6f6f6',
  },
  sectionText: {
    fontSize: 14,
    color: 'gray',
    fontWeight: '500',
  },
  languageSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  switchContainer: {
    width: 56,
    height: 28,
    borderRadius: 14,
    padding: 2,
    marginHorizontal: 10,
  },
  switchKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2d201c',
  },
  darkModeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  darkModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  darkModeText: {
    fontSize: 14,
    color: '#2d201c',
    flex: 1,
    marginLeft: 10,
  },
});

export default DrawerNavigator;
