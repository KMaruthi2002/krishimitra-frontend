import { createContext, useContext, useMemo } from "react";
import { makeT } from "./i18n";

const I18nContext = createContext({ lang: "en", t: (k) => k });

export function I18nProvider({ lang = "en", children }) {
  const value = useMemo(() => ({ lang, t: makeT(lang) }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  return useContext(I18nContext);
}
