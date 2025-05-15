import React, { useState, useEffect } from 'react';
import LanguageSwitcher from './components/LanguageSwitcher';
import './App.css';

function App() {
  const [googleTranslateLoaded, setGoogleTranslateLoaded] = useState(false);

  useEffect(() => {
    const checkGoogleTranslateSelect = () => {
      const selectElement = document.querySelector('#google_translate_element .goog-te-combo');
      if (selectElement) {
        setGoogleTranslateLoaded(true);
        console.log('Google Translate select element found:', selectElement);
      } else {
        setTimeout(checkGoogleTranslateSelect, 500);
      }
    };

    checkGoogleTranslateSelect();
  }, []);

  const handleLanguageChange = (languageCode) => {
    if (googleTranslateLoaded) {
      const selectElement = document.querySelector('#google_translate_element .goog-te-combo');
      if (selectElement) {
        selectElement.value = languageCode; // Set the value of the select
        selectElement.dispatchEvent(new Event('change', { bubbles: true })); // Trigger the change event
        console.log('Selected language:', languageCode);
      } else {
        console.warn('Google Translate select element not found when trying to change language.');
      }
    } else {
      console.warn('Google Translate widget not yet loaded.');
    }
  };

  return (
    <div className="App">
      <h1>My Translated Website</h1>
      <LanguageSwitcher onLanguageChange={handleLanguageChange} />
      <p>This is the original content of my website.</p>
    </div>
  );
}

export default App;