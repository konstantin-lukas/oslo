import React, {useContext, useEffect, useState} from "react";
import './GlobalSettings.scss';
import {LanguageContext, TextContext} from "./misc/Contexts";
import Dropdown from "./Dropdown";
import Button from "./Button";
import Checkbox from "./Checkbox";
import availableLanguages from '../lang.avail.json';

export default function GlobalSettings({open, setLanguage, setLightMode, lightMode}: {
    open: boolean,
    setLanguage: (lang: string) => void,
    setLightMode: (yes: boolean) => void,
    lightMode: boolean
}) {
    const text = useContext(TextContext);
    const lang = useContext(LanguageContext);
    return (                                                                                                                                                                                                                                                        
        <div id="global_settings" className={open ? 'open' : ''}>
            <label className="container"><span>{text?.export_data_}</span>
                <Button altColors={true} onClick={() => {
                    api.window.export();
                }}>{text.export_}</Button>
            </label>
            <label className="container"><span>{text?.import_data_}</span>
                <Button altColors={true} onClick={() => alert("IMPORT")}>{text.import_}</Button>
            </label>
            <Checkbox label={text.dark_theme_} checked={!lightMode} onChange={() => {
                setLightMode(!lightMode);
            }}/>
            <label>
                <span id="lang_span">{text?.language_}</span>
                <Dropdown
                    labels={availableLanguages.map(lang => lang.name)}
                    values={availableLanguages.map(lang => lang.code)}
                    defaultSelected={lang}
                    returnValue={(newLang) => setLanguage(newLang)}
                    compact={true}
                />
            </label>
        </div>
    );
}