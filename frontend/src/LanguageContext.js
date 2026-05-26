import { createContext, useState } from "react";
import { useTranslation } from "react-i18next";

export const LanguageContext = createContext({
  currentLanguage: false,
  setCurrentLanguage: (value) => {},
});

export const LanguageContextProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(
    i18n.language?.split("-")[0],
  );

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
