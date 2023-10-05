import { createContext } from 'react';

export const LanguageContext = createContext(null);
export const TextContext = createContext<TextContent | null>(null);
export const AlertContext = createContext(null);
export const CurrencyContext = createContext(null);
export const FetchAccountsContext = createContext(null);
export const LightModeContext = createContext(false);