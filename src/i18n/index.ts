import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import trCommon from './tr/common.json';
import trAuth from './tr/auth.json';
import trClients from './tr/clients.json';
import trSessions from './tr/sessions.json';
import trAnamnesis from './tr/anamnesis.json';
import trDashboard from './tr/dashboard.json';
import trSettings from './tr/settings.json';
import trReports from './tr/reports.json';

import enCommon from './en/common.json';
import enAuth from './en/auth.json';
import enClients from './en/clients.json';
import enSessions from './en/sessions.json';
import enAnamnesis from './en/anamnesis.json';
import enDashboard from './en/dashboard.json';
import enSettings from './en/settings.json';
import enReports from './en/reports.json';

const deviceLang = Localization.getLocales()[0]?.languageCode || 'tr';
const defaultLang = deviceLang === 'en' ? 'en' : 'tr';

i18n.use(initReactI18next).init({
  resources: {
    tr: {
      common: trCommon, auth: trAuth, clients: trClients,
      sessions: trSessions, anamnesis: trAnamnesis,
      dashboard: trDashboard, settings: trSettings, reports: trReports,
    },
    en: {
      common: enCommon, auth: enAuth, clients: enClients,
      sessions: enSessions, anamnesis: enAnamnesis,
      dashboard: enDashboard, settings: enSettings, reports: enReports,
    },
  },
  lng: defaultLang,
  fallbackLng: 'tr',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

export default i18n;
