import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import EN_cities from "@/locales/en/cities.json";
import EN_regions from "@/locales/en/regions.json";
import FR_cities from "@/locales/fr/cities.json";
import FR_regions from "@/locales/fr/regions.json";
import AR_cities from "@/locales/ar/cities.json";
import AR_regions from "@/locales/ar/regions.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      cities: EN_cities,
      regions: EN_regions,
    },
    fr: {
      cities: FR_cities,
      regions: FR_regions,
    },
    ar: {
      cities: AR_cities,
      regions: AR_regions,
    },
  },
  ns: ["cities", "regions"],
  defaultNS: "cities",
  lng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;