import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const menuItems = [
    {
      icon: 'lock',
      title: t('settings.changePassword'),
      onPress: () => navigation.navigate('ChangePass')
    },
    {
      icon: 'moon',
      title: t('settings.darkMode.title'),
      onPress: () => navigation.navigate('ThemeSettings')
    },
    {
      icon: 'globe',
      title: t('settings.language'),
      onPress: () => navigation.navigate('LanguageSettings')
    },
    // {
    //   icon: 'help-circle',
    //   title: t('settings.support'),
    //   onPress: () => navigation.navigate('SupportScreen')
    // },
    // {
    //   icon: 'info',
    //   title: t('settings.aboutUs'),
    //   onPress: () => navigation.navigate('AboutUsScreen')
    // }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              {
                borderBottomColor: theme.borderColor,
                borderBottomWidth: index === menuItems.length - 1 ? 0 : 1
              }
            ]}
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
  },
  menuContainer: {
    margin: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
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

export default SettingsScreen;