import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cấu hình notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.MAX
  })
});

export const NotificationHelper = {
  // Đăng ký nhận thông báo
  registerForPushNotificationsAsync: async () => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Không thể nhận thông báo vì quyền thông báo bị từ chối!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Phải sử dụng thiết bị vật lý để nhận thông báo!');
    }
    return token;
  },

  // Hiển thị thông báo cục bộ
  showLocalNotification: async (title, message, data) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: message,
          data: data || {},
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
          channelId: 'orders'
        },
        trigger: null
      });
    } catch (error) {
      console.error('Error showing local notification:', error);
    }
  }
};