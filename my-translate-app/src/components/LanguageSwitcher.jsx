// LanguageSwitcher.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"; // Import useMemo

const LanguageSwitcher = ({ onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguageCode, setCurrentLanguageCode] = useState("en"); // Default to English
  const dropdownRef = useRef(null);

  // === Wrap languageCodes in useMemo ===
  const languageCodes = useMemo(() => ({
    en: "English",
    hi: "Hindi",
    ta: "Tamil",
    te: "Telugu",
    ml: "Malayalam",
    gu: "Gujarati",
  }), []); // Empty dependency array means create this object only once
  // =====================================

  // Function to parse the googtrans cookie
  const getGoogleTranslateCookie = useCallback(() => {
    const name = "googtrans";
    const decodedCookie = document.cookie;
    const ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name + "=") === 0) {
            const cookieValue = c.substring(name.length + 1);
            const parts = cookieValue.split('/');
            if (parts.length > 2 && parts[2] && parts[2] !== '') {
                return parts[2]; // Return the target language code
            }
        }
    }
    return "en"; // Default to 'en' if cookie not found or invalid format
  }, []); // No dependencies needed here as it doesn't use props or state

  // Effect to read the cookie and set the current language on mount
  useEffect(() => {
    const code = getGoogleTranslateCookie();
    setCurrentLanguageCode(code);
  }, [getGoogleTranslateCookie]);


  const handleLanguageSelect = useCallback((code) => {
    // --- ADDED CHECK HERE ---
    // Use the memoized languageCodes
    if (code === currentLanguageCode) {
        setIsOpen(false); // Close the dropdown
        return; // Stop the function here, do not call onLanguageChange
    }
    // --- END ADDED CHECK ---

    setIsOpen(false);
    setCurrentLanguageCode(code); // Update UI immediately for responsiveness
    if (onLanguageChange) {
      onLanguageChange(code); // This triggers the cookie set and reload in App.jsx
    }
  }, [onLanguageChange, currentLanguageCode]); // languageCodes dependency now stable

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
        {/* Use the memoized languageCodes */}
        {languageCodes[currentLanguageCode] || "Language"}
      </button>
      {isOpen && (
        <ul className="language-dropdown">
          {/* Use the memoized languageCodes */}
          {Object.keys(languageCodes).map((code) => (
            <li
              key={code}
              onClick={() => handleLanguageSelect(code)}
              className={code === currentLanguageCode ? 'language-selected' : ''}
            >
              {/* Use the memoized languageCodes */}
              <span className="notranslate">{languageCodes[code]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;