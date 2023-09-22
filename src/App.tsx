import React, {useEffect, useState} from "react";
import Header from "./components/Header";
import Account from "./components/Account";
import Alert from "./components/Alert";
import StandingOrders from "./components/StandingOrders";
import GlobalSettings from "./components/GlobalSettings";
import {AlertContext, LanguageContext, TextContext} from "./components/misc/Contexts";
import availableLanguages from './lang.json';
import {ThemeProvider} from "styled-components";
import NoAccounts from "./components/NoAccounts";


export default function App() {
    const [alert, setAlert] = useState(null);
    const [triggerFetchFlag, setTriggerFetchFlag] = useState(false);
    const [language, setLanguage] = useState<string>(null);
    const [accounts, setAccounts] = useState(null);
    const [openAccount, setOpenAccount] = useState<AccountData | null>(null);
    const [textContent, setTextContent] = useState(null);
    const [themeColor, setThemeColor] = useState({
        theme_color: {
            r: 0xff,
            g: 0x33,
            b: 0xa3
        },
        neutral_color: '#1a1a1a',
        neutral_opposite: '#ffffff',
        other_opposite: '#444444'
    });

    useEffect(() => {
        if (!localStorage.getItem("language"))
            localStorage.setItem("language", "en");
        setLanguage(localStorage.getItem("language"));
        api.getAccounts().then(data => {
            if (data && !localStorage.getItem("last_tab"))
                localStorage.setItem("last_tab", data[0].id);
            const last_tab = parseInt(localStorage.getItem("last_tab"));
            const openAccount = data.find((acc: {id: number})=> acc.id === last_tab);
            setOpenAccount(openAccount || data[0]);
            setAccounts(data);
        });
    }, [triggerFetchFlag]);

    useEffect(() => {
        api.textContent(availableLanguages[3].code).then(result => setTextContent(result));
    }, [language]);

    useEffect(() => {
        const red = Number('0x' + openAccount?.theme_color[0] + openAccount?.theme_color[1]);
        const green = Number('0x' + openAccount?.theme_color[2] + openAccount?.theme_color[3]);
        const blue = Number('0x' + openAccount?.theme_color[4] + openAccount?.theme_color[5]);
        const color = {r: red, g: green, b: blue};
        const contrast = (function () {
            const brightness = Math.round(((color.r * 299) + (color.g * 587) + (color.b * 114)) / 1000);
            return (brightness > 125) ? '#1a1a1a' : '#fff';
        })();
        const contrast_opposite = (contrast == '#fff') ? '#1a1a1a' : '#fff';
        const alt_opp = (contrast == '#1a1a1a') ? '#444' : '#fff';
        setThemeColor({
            theme_color: color,
            neutral_color: contrast,
            neutral_opposite: contrast_opposite,
            other_opposite: alt_opp
        });
        const open_tab = openAccount?.id?.toString();
        if (open_tab)
            localStorage.setItem("last_tab", open_tab);
    }, [openAccount]);

    // TODO
/*    const StyledDiv = styled.div`
      & *::selection {
        color: ${colors.neutral_color};
        background: rgba(${colors.theme_color.r},${colors.theme_color.g},${colors.theme_color.b},0.99);
      }
    `;*/

    if (!accounts || accounts.length === 0)
        return (
            <div>
                <Header
                    tabs={accounts || []}
                    openId={openAccount?.id}
                    setOpenAccount={setOpenAccount}
                    triggerFetch={() => setTriggerFetchFlag(!triggerFetchFlag)}
                />
                <NoAccounts/>
            </div>
        )

    return (
        <div>
            <TextContext.Provider value={textContent}>
                <LanguageContext.Provider value={language}>
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
                                triggerFetch={() => setTriggerFetchFlag(!triggerFetchFlag)}
                            />
                            <Account
                                openAccount={openAccount}
                                fetchAccounts={() => setTriggerFetchFlag(!triggerFetchFlag)}
                            />
                            <StandingOrders/>
                            <GlobalSettings/>
                        </AlertContext.Provider>
                        <Alert
                            message={alert?.message}
                            confirmAction={alert?.confirmAction}
                        />
                    </ThemeProvider>
                </LanguageContext.Provider>
            </TextContext.Provider>
        </div>
    )
}