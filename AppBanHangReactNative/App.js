import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import './src/config/i18n';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import WelcomeScreen from './src/pages/welcome/Welcome';
import Introduce from './src/pages/welcome/Introduce';
import LoginScreen from './src/screens/login/LoginScreen';
import RegisterScreen from './src/screens/login/RegisterScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import SearchScreen from './src/pages/search/Search';
import AddProductScreen from './src/screens/product/product_crud/addProduct/AddProduct';
import EditProduct from './src/screens/product/product_crud/editProducts/EditProduct';
import ProductDetail from './src/pages/productDetail/ProductDetail';
import SearchResults from './src/pages/SearchResults/SearchResults';
import CartScreen from './src/screens/cart/CartScreen';
import OrderPayment from './src/pages/orderPayment/OrderPayment';
import EditProfile from './src/screens/profile/editProfile/EditProfile';
import AddressScreen from './src/screens/profile/address/AddressScreen';
import AddAddress from './src/screens/profile/address/add_Address/AddAddress';
import EditAddress from './src/screens/profile/address/edit_address/EditAddress';
import VoucherScreen from './src/screens/profile/voucher/VoucherScreen';
import WalletScreen from './src/screens/profile/e-wallet/WalletScreen';
import RechargeScreen from './src/screens/profile/e-wallet/recharge/RechargeScreen';
import SuccessfulPayment from './src/pages/successfulPayment/SuccessfulPayment';
import OrderDetail from './src/pages/orderDetail/OrderDetail';
import NotificationScreen from './src/pages/notification/NotificationScreen';
import NotificationIcon from './src/pages/notification/NotificationIcon';
import * as Notifications from 'expo-notifications';
import { NotificationHelper } from './src/utils/NotificationHelper';
import { Platform } from 'react-native';

// Add these imports
import EnterEmail from './src/screens/login/confirmPassword/EnterEmail';
import EnterOTP from './src/screens/login/confirmPassword/EnterOTP';
import ChangePassword from './src/screens/login/confirmPassword/ChangePassword';
import ChatScreen from './src/screens/home/chat/ChatScreen';
import ChatListScreen from './src/screens/home/chat/ChatListScreen';

// Import đúng component ChangePass từ settings 
import ChangePass from './src/screens/settings/changepass/ChangePass';
import ThemeSettings from './src/screens/settings/theme/ThemeSettingsScreen';
import LanguageSettings from './src/screens/settings/language/LanguageSettingsScreen';

// Add this import
import ReasonReturn from './src/screens/order/ReasonReturn';
import ReviewOrder from './src/screens/order/ReviewOrder';

// Create a stack navigator for the app
const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // Create notification channel for Android
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('orders', {
        name: 'Orders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: true,
        enableVibrate: true,
        showBadge: true
      });
    }

    // Register for notifications
    NotificationHelper.registerForPushNotificationsAsync();

    // Handle notification when app is running
    const notificationListener = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('Received notification:', notification);
      }
    );

    // Handle notification when app is in background
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log('Notification tapped:', response);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Welcome' component={WelcomeScreen} />
          <Stack.Screen name='Introduce' component={Introduce} />
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='Register' component={RegisterScreen} />
          <Stack.Screen name='Drawer' component={DrawerNavigator} />

          {/* Đổi tên component và route cho chức năng đổi mật khẩu trong settings */}
          <Stack.Screen name='ChangePass' component={ChangePass} />

          {/* Giữ nguyên route cho chức năng quên mật khẩu */}
          <Stack.Screen name='EnterEmail' component={EnterEmail} />
          <Stack.Screen name='EnterOTP' component={EnterOTP} />
          <Stack.Screen name='ChangePassword' component={ChangePassword} />

          <Stack.Screen name='Home' component={HomeScreen} />
          <Stack.Screen name='Cart' component={CartScreen} />
          <Stack.Screen name='Search' component={SearchScreen} />
          <Stack.Screen name='SearchResults' component={SearchResults} />
          <Stack.Screen name='ProductDetail' component={ProductDetail} />
          <Stack.Screen name='AddProduct' component={AddProductScreen} />
          <Stack.Screen name='EditProduct' component={EditProduct} />
          <Stack.Screen name='OrderPayment' component={OrderPayment} />
          <Stack.Screen name='EditProfile' component={EditProfile} />
          <Stack.Screen name='AddressScreen' component={AddressScreen} />
          <Stack.Screen name='AddAddress' component={AddAddress} />
          <Stack.Screen name='EditAddress' component={EditAddress} />
          <Stack.Screen name='VoucherScreen' component={VoucherScreen} />
          <Stack.Screen name='WalletScreen' component={WalletScreen} />
          <Stack.Screen name="RechargeScreen" component={RechargeScreen} />
          <Stack.Screen name="SuccessfulPayment" component={SuccessfulPayment} />
          <Stack.Screen name="OrderDetail" component={OrderDetail} />
          <Stack.Screen name="Notifications" component={NotificationScreen} />
          <Stack.Screen name="NotificationIcon" component={NotificationIcon} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="ChatList" component={ChatListScreen} />
          <Stack.Screen name="ThemeSettings" component={ThemeSettings} />
          <Stack.Screen name="LanguageSettings" component={LanguageSettings} />
          <Stack.Screen  name="ReasonReturn" component={ReasonReturn}options={{headerShown: false}}/>
          <Stack.Screen  name="ReviewOrder" component={ReviewOrder}options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}