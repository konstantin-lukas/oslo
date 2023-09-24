import React, {useEffect, useMemo, useState} from 'react';
import './Header.scss';
import GlobalSettings from "./GlobalSettings";

export default function Header({tabs, openId, setOpenAccount, setLanguage, setLightMode, lightMode}: {
    tabs: AccountData[],
    openId: number,
    setOpenAccount: (account: AccountData) => void,
    setLanguage: (lang: string) => void,
    setLightMode: (yes: boolean) => void,
    lightMode: boolean
}) {
    const [isWindowMaximized, setIsWindowMaximized] = useState<boolean>(true);
    useEffect(() => {
        api.window.unsubscribeMaximizeAll();
        api.window.unsubscribeUnmaximizeAll();
        api.window.maximizeCallback(() => setIsWindowMaximized(true));
        api.window.unmaximizeCallback(() => setIsWindowMaximized(false));
    }, []);
    const [settingsOpen, setSettingsOpen] = useState(false);


    const tabElements = useMemo(() => tabs.map(tab => {
        return (
            <div
                key={tab.id}
                className={'tab' + (tab.id === openId ? ' current_tab' : '')}
                onClick={() => setOpenAccount(tab)}
            >
                <span style={{
                    color: '#' + tab.theme_color
                }}>{tab.name}</span>
            </div>
        );
    }), [tabs, openId])

    return (
        <header className={isWindowMaximized ? 'maximized' : ''}>
            <div id="tab-group">
                {tabElements}
                <button
                    type="button"
                    name="add_tab"
                    className={openId ? "" : "current_tab"}
                    onClick={() => {
                        setOpenAccount(null);
                    }}
                ></button>
            </div>
            <div className="window_nav" id="config-btn" onClick={() => setSettingsOpen(!settingsOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <span className="window_nav" id="min-btn" onClick={api.window.minimizeApp}></span>
            <span className="window_nav" id="max-btn" onClick={api.window.maximizeApp}></span>
            <span className="window_nav" id="close-btn" onClick={api.window.closeApp}></span>
            <GlobalSettings
                open={settingsOpen}
                setLanguage={setLanguage}
                setLightMode={setLightMode}
                lightMode={lightMode}
            />
        </header>
    )
}