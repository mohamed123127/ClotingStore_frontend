// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../resources/locales/en/translation.json";
import ar from "../resources/locales/ar/translation.json";
import fr from "../resources/locales/fr/translation.json";


// تهيئة i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      fr: { translation: fr },
    },
    lng: "en", // اللغة الافتراضية
    fallbackLng: "en", // اذا ما لقا الترجمة يرجع للإنجليزية
    interpolation: {
      escapeValue: false, // React يتكفل بالـ XSS
    },
  });

export default i18n;
