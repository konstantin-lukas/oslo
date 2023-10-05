import React, {forwardRef, useContext} from "react";
import './GlobalSettings.scss';
import {AlertContext, FetchAccountsContext, LanguageContext, LightModeContext, TextContext} from "./misc/Contexts";
import Dropdown from "./Dropdown";
import Button from "./Button";
import Checkbox from "./Checkbox";
import availableLanguages from '../lang.avail';
import {useTheme} from "styled-components";

export default forwardRef(function GlobalSettings({open, setLanguage, setLightMode}: {
    open: boolean,
    setLanguage: (lang: string) => void,
    setLightMode: (yes: boolean) => void,
}, ref: React.Ref<HTMLDivElement>) {
    const text = useContext(TextContext);
    const lang = useContext(LanguageContext);
    const fetchAccounts = useContext(FetchAccountsContext);
    const alert = useContext(AlertContext);
    const lightMode = useContext(LightModeContext);
    const theme = useTheme();

    return (
        <div id="global_settings" className={open ? 'open' : ''} ref={ref}>
            <label className="container"><span>{text?.export_data_}</span>
                <Button
                    altColors={!lightMode && theme.neutral_color === '#1a1a1a'}
                    onClick={() => {
                        api.window.export().then((status) => {
                            if (status !== 'cancel') {
                                alert(
                                    status === 'success' ? text.export_successful_ : text.export_failed_,
                                    () => {}
                                );
                            }
                        });
                }}>{text.export_}</Button>
            </label>
            <label className="container"><span>{text?.import_data_}</span>
                <Button
                    altColors={!lightMode && theme.neutral_color === '#1a1a1a'}
                    onClick={() => {
                        alert(
                            text.confirm_import_,
                            () => api.window.import().then(status => {
                                if (status !== 'cancel') {
                                    alert(
                                        status === 'success' ? text.import_successful_ : text.import_failed_,
                                        () => {}
                                    )
                                    fetchAccounts();
                                }
                            }),
                            () => {}
                        );
                }}>{text.import_}</Button>
            </label>
            <Checkbox label={text.dark_theme_} checked={!lightMode} onChange={() => {
                setLightMode(!lightMode);
            }}/>
            <label>
                <span id="lang_span">{text?.language_}</span>
                <Dropdown
                    labels={availableLanguages.map(lang => lang.name)}
                    values={availableLanguages.map(lang => lang.code)}
                    defaultSelected={lang.code}
                    returnValue={(newLang) => setLanguage(newLang)}
                    compact={true}
                />
            </label>
        </div>
    );
})