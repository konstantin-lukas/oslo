import { createContext } from 'react';

export const LanguageContext = createContext<string>('en');
export const TextContext = createContext<TextContent | null>(null);
export const AlertContext = createContext(null);
export const CurrencyContext = createContext(null);
export const FetchAccountsContext = createContext(null);