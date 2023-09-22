import React, {useEffect, useState} from "react";
import Header from "./components/Header";
import Account from "./components/Account";
import Alert from "./components/Alert";
import StandingOrders from "./components/StandingOrders";
import GlobalSettings from "./components/GlobalSettings";
import {LanguageContext, TextContext} from "./components/misc/Contexts";
import availableLanguages from './lang.json';
import {ThemeProvider} from "styled-components";


export default function App() {
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


        // DATA
        api.textContent(availableLanguages[3].code).then(result => setTextContent(result));

        // COLOR
        const color = {r: 0xff, g: 0x33, b: 0xa3};
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
    }, []);

    useEffect(() => {
        api.getAccounts().then(data => {
            if (data && !localStorage.getItem("last_tab"))
                localStorage.setItem("last_tab", data[0].id);
            const last_tab = parseInt(localStorage.getItem("last_tab"));
            setOpenAccount(data.find((acc: {id: number})=> acc.id === last_tab));
            setAccounts(data);
        });
    }, [language]);

    // TODO
/*    const StyledDiv = styled.div`
      & *::selection {
        color: ${colors.neutral_color};
        background: rgba(${colors.theme_color.r},${colors.theme_color.g},${colors.theme_color.b},0.99);
      }
    `;*/


    return (
        <div>
            <TextContext.Provider value={textContent}>
                <LanguageContext.Provider value={language}>
                    <ThemeProvider theme={themeColor}>
                        <Header
                            tabs={accounts || []}
                            openId={openAccount?.id}
                            setOpenAccount={setOpenAccount}
                        />
                        <Account
                            openAccount={openAccount}
                        />
                        <StandingOrders/>
                        <GlobalSettings/>
                        <Alert/>
                    </ThemeProvider>
                </LanguageContext.Provider>
            </TextContext.Provider>
        </div>
    )
}