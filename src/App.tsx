import React, {useEffect, useState} from "react";
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
import langSample from "./lang.sample.json";
import './lightMode.scss';

export default function App() {
    const [alert, setAlert] = useState(null);
    const [triggerFetchFlag, setTriggerFetchFlag] = useState(false);
    const [language, setLanguage] = useState<string>('en');
    const [lightMode, setLightMode] = useState<boolean>(false);
    const [accounts, setAccounts] = useState(null);
    const [openAccount, setOpenAccount] = useState<AccountData | null>(null);
    const [textContent, setTextContent] = useState(langSample);
    const [fetchSettingsFlag, setFetchSettingsFlag] = useState(false);
    const [currency, setCurrency] = useState({
        name: 'USD',
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
            api.settings.getLanguage().then(res => setLanguage(res));
            api.settings.getLightMode().then(res => setLightMode(res));
        }
    }, [fetchSettingsFlag]);

    useEffect(() => {
        (async () => {
            const acc = await api.db.getAccounts();
            let last_tab = parseInt(await api.settings.getLastTab());
            const openAccount = acc.find((acc: {id: number})=> acc.id === last_tab);
            setOpenAccount(openAccount || acc[0]);
            setAccounts(acc);
        })();
    }, [triggerFetchFlag]);

    useEffect(() => {
        api.textContent(language).then(result => setTextContent(result));
        api.settings.setLanguage(language);
    }, [language]);

    useEffect(() => {
        if (fetchSettingsFlag) {
            api.settings.setLightMode(lightMode);
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
        const open_tab = openAccount?.id;
        if (open_tab) {
            api.settings.setLastTab(open_tab);
            setCurrency({
                name: openAccount.currency,
                decimalPlaces: 2
            });
        }
    }, [openAccount]);

    if (!openAccount)
        return (
            <TextContext.Provider value={textContent}>
                <LanguageContext.Provider value={language}>
                    <FetchAccountsContext.Provider value={() => setTriggerFetchFlag(!triggerFetchFlag)}>
                        <LightModeContext.Provider value={lightMode}>
                            <ThemeProvider theme={{
                                theme_color: '#ffffff',
                                neutral_color: '#1a1a1a',
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
                                    <div className={lightMode ? 'light_mode' : ''}>
                                        <Header
                                            tabs={accounts || []}
                                            openId={openAccount?.id}
                                            setOpenAccount={setOpenAccount}
                                            setLanguage={setLanguage}
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
        <div className={lightMode ? 'light_mode' : ''}>
            <TextContext.Provider value={textContent}>
                <LanguageContext.Provider value={language}>
                    <CurrencyContext.Provider value={currency}>
                        <FetchAccountsContext.Provider value={() => setTriggerFetchFlag(!triggerFetchFlag)}>
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
                                            setLanguage={setLanguage}
                                            setLightMode={setLightMode}
                                        />
                                        <Account openAccount={openAccount}/>
                                        <StandingOrders/>
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