import React, {useCallback, useEffect, useState} from "react";
import Header from "./components/Header";
import Account from "./components/Account";
import Alert from "./components/Alert";
import StandingOrders from "./components/StandingOrders";
import {
    AlertContext,
    CurrencyContext,
    FetchAccountsContext,
    LanguageContext, LightModeContext,
    TextContext
} from "./components/misc/Contexts";
import {ThemeProvider} from "styled-components";
import NoAccounts from "./components/NoAccounts";
import langSample from "./lang/en.json";
import './lightMode.scss';
import './lang.scss';
import availableLanguages from "./lang.avail";
import {getCurrencySymbol, getDecimalPlaces} from "./components/misc/Format";

export default function App() {
    const [alert, setAlert] = useState(null);
    const [language, setLanguage] = useState(availableLanguages[0]);
    const [lightMode, setLightMode] = useState<boolean>(false);
    const [accounts, setAccounts] = useState(null);
    const [openAccount, setOpenAccount] = useState<AccountData | null>(null);
    const [textContent, setTextContent] = useState(langSample);
    const [fetchSettingsFlag, setFetchSettingsFlag] = useState(false);
    const [openOrders, setOpenOrders] = useState(false);
    const [currency, setCurrency] = useState({
        name: 'USD',
        symbol: '$',
        decimalPlaces: 2
    });
    const [themeColor, setThemeColor] = useState({
        theme_color: '#ff33a3',
        neutral_color: '#1a1a1a',
        neutral_opposite: '#ffffff',
        other_opposite: '#444444'
    });

    useEffect(() => {
        setFetchSettingsFlag(true);
    }, []);

    useEffect(() => {
        if (fetchSettingsFlag) {
            api.settings.getLanguage().then(res => {
                const lang = availableLanguages.find(lang => lang.code === res);
                if (lang) setLanguage(lang);
            });
            api.settings.getLightMode().then(res => setLightMode(res));
        }
    }, [fetchSettingsFlag]);

    useEffect(() => {
        if (fetchSettingsFlag) {
            api.textContent(language.code).then(result => setTextContent(result)).then(() => {
                api.settings.setLanguage(language.code).then();
            });
        }
    }, [language]);

    useEffect(() => {
        if (fetchSettingsFlag) {
            api.settings.setLightMode(lightMode).then();
        }
    }, [lightMode]);

    useEffect(() => {
        const red = Number('0x' + openAccount?.theme_color[0] + openAccount?.theme_color[1]);
        const green = Number('0x' + openAccount?.theme_color[2] + openAccount?.theme_color[3]);
        const blue = Number('0x' + openAccount?.theme_color[4] + openAccount?.theme_color[5]);
        const color = {r: red, g: green, b: blue};

        const contrast = (function () {
            const brightness = Math.round(((color.r * 299) + (color.g * 587) + (color.b * 114)) / 1000);
            return (brightness > 125) ? '#1a1a1a' : '#ffffff';
        })();
        const contrast_opposite = (contrast === '#ffffff') ? '#1a1a1a' : '#ffffff';
        const alt_opp = (contrast == '#1a1a1a') ? '#444444' : '#ffffff';

        setThemeColor({
            theme_color: '#' + (openAccount?.theme_color || 'ffffff'),
            neutral_color: contrast,
            neutral_opposite: contrast_opposite,
            other_opposite: alt_opp
        });
    }, [openAccount]);

    useEffect(() => {

        const open_tab = openAccount?.id;
        if (open_tab) {
            api.settings.setLastTab(open_tab).then();
            setCurrency({
                name: openAccount.currency,
                symbol: getCurrencySymbol(language.code, openAccount.currency),
                decimalPlaces: getDecimalPlaces(openAccount.currency)
            });
        }
    }, [openAccount, language]);

    const [openLastFlag, setOpenLastFlag] = useState(false);
    useEffect(() => {
        if (openLastFlag) {
            setOpenAccount(accounts[accounts.length - 1]);
            setOpenLastFlag(false);
        }
    }, [accounts]);

    const fetchAccounts = useCallback(async (openAccount?: 'first' | 'last' | 'fromSettings' | number) => {
        const acc = await api.db.getAccounts();
        if (openAccount === 'first') {
            setOpenAccount(acc[0]);
        } else if (openAccount === 'last') {
            setOpenAccount(acc[acc.length - 1]);
        } else if (openAccount === 'fromSettings') {
            const last_tab = parseInt(await api.settings.getLastTab());
            setOpenAccount(acc.find((acc: {id: number})=> acc.id === last_tab) || acc[0]);
        } else if (typeof openAccount === 'number') {
            const index = accounts?.map((account: AccountData) => account.id).indexOf(openAccount);
            if (index >= acc.length) {
                setOpenAccount(acc[acc.length - 1]);
            } else {
                setOpenAccount(acc[index]);
            }
        }
        setAccounts(acc);
    }, [accounts, setAccounts, setOpenAccount]);

    useEffect(() => {
        fetchAccounts('fromSettings').then()
    }, []);

    if (!openAccount)
        return (
            <TextContext.Provider value={textContent}>
                <LanguageContext.Provider value={language}>
                    <FetchAccountsContext.Provider value={fetchAccounts}>
                        <LightModeContext.Provider value={lightMode}>
                            <ThemeProvider theme={{
                                theme_color: lightMode ? '#1a1a1a' : '#ffffff',
                                neutral_color: !lightMode ? '#1a1a1a' : '#ffffff',
                                neutral_opposite: '#ffffff',
                                other_opposite: '#444444'
                            }}>
                                <AlertContext.Provider value={(
                                    message: string,
                                    confirmAction: () => void,
                                    cancelAction: () => void
                                ) => {
                                    setAlert({
                                        message,
                                        confirmAction,
                                        cancelAction
                                    });
                                }}>
                                    <div
                                        className={'lang-' + language.code + (lightMode ? ' light_mode' : '')}
                                    >
                                        <Header
                                            tabs={accounts || []}
                                            openId={openAccount?.id}
                                            setOpenAccount={setOpenAccount}
                                            setLanguage={res => setLanguage(
                                                availableLanguages.find(lang => lang.code === res)
                                            )}
                                            setLightMode={setLightMode}
                                        />
                                        <NoAccounts/>
                                        <Alert
                                            message={alert?.message}
                                            confirmAction={alert?.confirmAction}
                                            cancelAction={alert?.cancelAction}
                                        />
                                    </div>
                                </AlertContext.Provider>
                            </ThemeProvider>
                        </LightModeContext.Provider>
                    </FetchAccountsContext.Provider>
                </LanguageContext.Provider>
            </TextContext.Provider>
        )

    return (
        <div
            className={'lang-' + language.code + (openOrders ? ' open_orders' : '') + (lightMode ? ' light_mode' : '')}
        >
            <TextContext.Provider value={textContent}>
                <LanguageContext.Provider value={language}>
                    <CurrencyContext.Provider value={currency}>
                        <FetchAccountsContext.Provider value={fetchAccounts}>
                            <LightModeContext.Provider value={lightMode}>
                                <ThemeProvider theme={themeColor}>
                                    <AlertContext.Provider value={(
                                        message: string,
                                        confirmAction: () => void,
                                        cancelAction: () => void
                                    ) => {
                                        setAlert({
                                            message,
                                            confirmAction,
                                            cancelAction
                                        });
                                    }}>
                                        <Header
                                            tabs={accounts || []}
                                            openId={openAccount?.id}
                                            setOpenAccount={setOpenAccount}
                                            setLanguage={res => setLanguage(
                                                availableLanguages.find(lang => lang.code === res)
                                            )}
                                            setLightMode={setLightMode}
                                        />
                                        <Account
                                            openAccount={openAccount}
                                            openStandingOrders={() => setOpenOrders(true)}
                                        />
                                        <StandingOrders
                                            openAccount={openAccount}
                                            closeStandingOrders={() => setOpenOrders(false)}
                                        />
                                    </AlertContext.Provider>
                                    <Alert
                                        message={alert?.message}
                                        confirmAction={alert?.confirmAction}
                                        cancelAction={alert?.cancelAction}
                                    />
                                </ThemeProvider>
                            </LightModeContext.Provider>
                        </FetchAccountsContext.Provider>
                    </CurrencyContext.Provider>
                </LanguageContext.Provider>
            </TextContext.Provider>
        </div>
    )
}