import { createContext } from 'react';

export const LanguageContext = createContext<string>('en');
export const TextContext = createContext<TextContent | null>(null);