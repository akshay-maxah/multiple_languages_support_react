import React, { useState, useEffect, useRef } from "react";

const LanguageSwitcher = ({ onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default to English
  const dropdownRef = useRef(null);

  const languageCodes = {
    en: "English",
    hi: "Hindi", // Corrected language code for Hindi
    ta: "Tamil",
    te: "Telugu",
    ml: "Malayalam",
    gu: "Gujarati",
  };

  const handleChange = (languageCode) => {
    setIsOpen(false);
    setSelectedLanguage(languageCode);
    if (onLanguageChange) {
      onLanguageChange(languageCode);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        {languageCodes[selectedLanguage] || "Language"}
      </button>
      {isOpen && (
        <ul className="language-dropdown">
          {Object.entries(languageCodes).map(([code, name]) => (
            <li key={code} onClick={() => handleChange(code)}>
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;