import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import vi from './vi.json';

i18n.use(initReactI18next).init({
  resources: { en: { quiz: en }, vi: { quiz: vi } },
  lng: localStorage.getItem('lang') ?? 'en',
  fallbackLng: 'en',
  ns: ['quiz'],
  defaultNS: 'quiz',
});

export default i18n;