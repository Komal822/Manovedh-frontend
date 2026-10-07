import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("manovedh_language") || "en";
  });

  useEffect(() => {
    localStorage.setItem(
      "manovedh_language",
      language
    );
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {

  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}