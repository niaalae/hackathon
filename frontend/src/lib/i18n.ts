import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import EN_cities from "@/locales/en/cities.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      cities: EN_cities
    }
  },
  ns: ["cities"],
  defaultNS: "cities",
  lng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;