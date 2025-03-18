import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('vi');

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('userLanguage');
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
        i18n.changeLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const changeLanguage = async (lng) => {
    try {
      await AsyncStorage.setItem('userLanguage', lng);
      setCurrentLanguage(lng);
      i18n.changeLanguage(lng);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>{t('common.language')}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: currentLanguage === 'vi' ? '#007AFF' : '#DDDDDD',
            borderRadius: 5,
          }}
          onPress={() => changeLanguage('vi')}
        >
          <Text style={{ color: currentLanguage === 'vi' ? 'white' : 'black' }}>
            {t('language.vietnamese')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: currentLanguage === 'en' ? '#007AFF' : '#DDDDDD',
            borderRadius: 5,
          }}
          onPress={() => changeLanguage('en')}
        >
          <Text style={{ color: currentLanguage === 'en' ? 'white' : 'black' }}>
            {t('language.english')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LanguageSwitcher;