import React, { useState, useEffect, useRef, useCallback } from "react";

const LanguageSwitcher = ({ onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguageCode, setCurrentLanguageCode] = useState("en"); // Default to English
  const dropdownRef = useRef(null);

  const languageCodes = {
    en: "English",
    hi: "Hindi",
    ta: "Tamil",
    te: "Telugu",
    ml: "Malayalam",
    gu: "Gujarati",
  };

  const handleLanguageSelect = useCallback((code) => {
    setIsOpen(false);
    setCurrentLanguageCode(code);
    console.log("Selected Language Code:", code);
    if (onLanguageChange) {
      onLanguageChange(code);
    }
  }, [onLanguageChange]);

  const toggleOpen = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }, []);

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
      <button className="notranslate" onClick={toggleOpen}>
        {languageCodes[currentLanguageCode] || "Language"}
      </button>
      {isOpen && (
        <ul className="language-dropdown">
          {Object.keys(languageCodes).map((code) => (
            <li key={code} onClick={() => handleLanguageSelect(code)}>
              <span className="notranslate">{languageCodes[code]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;