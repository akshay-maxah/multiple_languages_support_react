// App.jsx
import React, { useState, useEffect, useCallback } from "react";
import LanguageSwitcher from "./components/LanguageSwitcher"; // Ensure this path is correct
import "./App.css";

// Helper function to check for googtrans cookie
// (Keeping this function here or in a utility file is fine)
const isTranslatedViaCookie = () => {
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
           if(parts.length > 2 && parts[2] && parts[2] !== 'en' && parts[2] !== '') {
               return true;
           }
      }
  }
  return false;
};


function App() {
  // Keeping isTranslateReady state to gate the handleLanguageChange logic
  const [isTranslateReady, setIsTranslateReady] = useState(
    window.googleTranslateWidgetInitialized || false
  );

   // --- Keep the isLoading state and effects for the full-page loader if you want it ---
   // If you removed the full-page loader entirely, you can remove isLoading state and related effects.
   const [isLoading, setIsLoading] = useState(false);

    // Effect to determine initial loader state on mount
    useEffect(() => {
         if (isTranslatedViaCookie() || !window.googleTranslateWidgetInitialized) {
              setIsLoading(true);
         } else {
             setIsLoading(false);
         }
    }, []);

    // Effect to handle the Google Translate API ready event and hide loader
    useEffect(() => {
      const onTranslateApiReady = () => {
        setIsTranslateReady(true);

        const hideLoaderDelay = 500; // ms - Adjust as needed
        setTimeout(() => {
            setIsLoading(false);
        }, hideLoaderDelay);
      };

      if (window.googleTranslateWidgetInitialized && !isTranslateReady && isLoading) {
           const hideLoaderDelay = 500; // ms
           setTimeout(() => {
               setIsLoading(false);
           }, hideLoaderDelay);
           setIsTranslateReady(true);

      } else if (!window.googleTranslateWidgetInitialized) {
          window.addEventListener('googleTranslateWidgetReady', onTranslateApiReady);
      }

      return () => {
          if (!window.googleTranslateWidgetInitialized) {
               window.removeEventListener('googleTranslateWidgetReady', onTranslateApiReady);
          }
      };
    }, [isTranslateReady, isLoading]);

    // Effect to control the visibility of the actual loader element in the DOM
    useEffect(() => {
        const loaderElement = document.getElementById('page-loader');
        if (loaderElement) {
            if (isLoading) {
                loaderElement.classList.remove('hidden');
            } else {
                loaderElement.classList.add('hidden');
            }
        }
    }, [isLoading]);
   // --- End of isLoading state and effects ---

  const handleLanguageChange = useCallback(
    (languageCode) => {
      if (!isTranslateReady) {
        console.warn(
          "WARN: Attempted to change language, but Google Translate widget is not ready."
        );
        // You might want to show a user-facing message here like "Translation is loading, please try again."
        return;
      }

      const pageLanguage = "en"; // Or your site's original language code
      
      // Show the full-page loader immediately before reloading
      setIsLoading(true);

      document.cookie = `googtrans=/${pageLanguage}/${languageCode}; path=/`;
      window.location.reload();
    },
    [isTranslateReady] // Dependency: we need isTranslateReady here
  );

  return (
    <div className="App">
      <h1>My Translated Website</h1>{" "}

      {/* === Render LanguageSwitcher unconditionally === */}
      <LanguageSwitcher onLanguageChange={handleLanguageChange} />
      {/* === Remove the conditional rendering and the loading message === */}


      <p>This is the original content of my website that needs translation.</p>
      <p>Hello, world! How are you today?</p>{" "}
      <div className="test-translation">
        This specific text should change language.
      </div>{" "}
    </div>
  );
}

export default App;