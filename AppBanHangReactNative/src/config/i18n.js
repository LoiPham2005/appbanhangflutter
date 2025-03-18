import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { vi } from '../translations/vi';
import { en } from '../translations/en';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      vi: vi,
      en: en
    },
    lng: 'vi', // ngôn ngữ mặc định
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18next; 