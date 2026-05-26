import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { LanguageContext } from "../../LanguageContext";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const { currentLanguage, setCurrentLanguage } = useContext(LanguageContext);

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
    document.documentElement.setAttribute("lang", currentLanguage);
  }, [currentLanguage, i18n]);

  function handleLanguageChange(event) {
    const newValue = event.target.options[event.target.selectedIndex].value;

    setCurrentLanguage(newValue);
  }

  return (
    <select
      onBlur={handleLanguageChange} //https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-onchange.md
      onChange={handleLanguageChange}
      value={currentLanguage}
      className="border-0 bg-transparent text-xl language-select"
    >
      {/* eslint-disable i18next/no-literal-string */}
      <option value="en">English</option>
      <option value="de">Deutsch</option>
      <option value="es">Español</option>
      <option value="it">Italiano</option>
      <option value="fr">Français</option>
      <option value="ru">Pусский</option>
      <option value="ja">日本語</option>
      {/* eslint-enable */}
    </select>
  );
};

export default LanguageSelector;
