import React, {useContext, useEffect, useReducer, useRef, useState} from "react";
import './AccountSettings.scss';
import {AlertContext, TextContext} from "./misc/Contexts";
import Button from "./Button";
import Checkbox from "./Checkbox";
import Input from "./Input";
import ColorPicker from "./ColorPicker";

const accountSettingsReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'interest_rate':
            return {
                ...state,
                interest_rate: parseInt(action.payload)
            }
        case 'theme_color':
            return {
                ...state,
                theme_color: action.payload.substring(1)
            }
        case 'name':
            return {
                ...state,
                name: action.payload
            }
        case 'allow_overdrawing':
            return {
                ...state,
                allow_overdrawing: action.payload
            }
        case 'reset':
            return {
                name: action.payload.name,
                interest_rate: action.payload.interest_rate,
                theme_color: action.payload.theme_color,
                allow_overdrawing: action.payload.allow_overdrawing
            }
    }
}

export default function AccountSettings({openAccount, fetchAccounts}: {
    openAccount: AccountData,
    fetchTransactions: () => void,
    fetchAccounts: () => void
}) {
    const text = useContext(TextContext);
    const alert = useContext(AlertContext);
    const [defaultColor, setDefaultColor] = useState(openAccount.theme_color)
    const [settings, updateSettings] = useReducer(accountSettingsReducer, {
        name: openAccount.name,
        interest_rate: openAccount.interest_rate,
        theme_color: openAccount.theme_color,
        allow_overdrawing: openAccount.allow_overdrawing
    });
    const nameInput = useRef();
    const interestRateInput = useRef();
    useEffect(() => {
        setDefaultColor(openAccount.theme_color);
        updateSettings({type: 'reset', payload: openAccount});
        if (nameInput.current)
            (nameInput.current as HTMLInputElement).value = openAccount.name;
        if (interestRateInput.current)
            (interestRateInput.current as HTMLInputElement).value = openAccount.interest_rate.toString();
    }, [openAccount]);
    return (
        <div id="account_settings">
            <h2>{text?.settings_}</h2>
            <div id="options">
                <svg id="calendar_btn" viewBox="0 0 283.5 283.5">
                    <path style={{
                        fill: `#${defaultColor}`
                    }} d="M211,28.3v47.9h-45V28.3h-48.6v47.9h-45V28.3H0v247.2h283.5V28.3H211z M258.5,250.5H25v-160h233.5V250.5z"/>
                    <g>
                        <rect x="82.4" style={{
                        fill: `#${defaultColor}`
                    }} width="25" height="67"/>
                        <rect x="176" style={{
                        fill: `#${defaultColor}`
                    }} width="25" height="67"/>
                    </g>
                    <g>
                        <path style={{
                        fill: `#${defaultColor}`
                    }} d="M153.3,193.2c0,6.6-1.1,12.8-3.3,18.4c-2.9,7.9-7.9,14-14.8,18.4c-6.9,4.4-15.1,6.6-24.6,6.6
                                            c-9.3,0-17.5-2.3-24.6-7c-7.1-4.7-12.1-11-15.2-19c-1.7-4.8-2.7-10-2.9-15.5c0-1.5,0.7-2.2,2.2-2.2h21.7c1.5,0,2.2,0.7,2.2,2.2
                                            c0.5,4.1,1.2,7.1,2,9c1.1,3.2,2.9,5.7,5.4,7.5c2.5,1.8,5.5,2.7,8.9,2.7c6.9,0,11.6-3,14.2-9c1.7-3.7,2.6-8,2.6-12.9
                                            c0-5.8-0.9-10.5-2.8-14.2c-2.8-5.8-7.6-8.7-14.2-8.7c-1.4,0-2.8,0.4-4.2,1.2c-1.5,0.8-3.3,1.9-5.3,3.4c-0.5,0.4-1,0.6-1.5,0.6
                                            c-0.7,0-1.3-0.4-1.7-1.1l-10.9-15.3c-0.2-0.4-0.4-0.8-0.4-1.3c0-0.7,0.2-1.4,0.7-1.8l29.3-25.6c0.2-0.2,0.3-0.5,0.3-0.7
                                            c-0.1-0.2-0.3-0.4-0.6-0.4H72.6c-0.6,0-1.1-0.2-1.6-0.6c-0.4-0.4-0.6-1-0.6-1.6v-17.9c0-0.6,0.2-1.1,0.6-1.6c0.4-0.4,1-0.6,1.6-0.6
                                            h76.9c0.6,0,1.1,0.2,1.6,0.6c0.4,0.4,0.6,1,0.6,1.6v20.3c0,1-0.4,1.9-1.3,2.8l-24.1,22.1c-0.2,0.2-0.3,0.5-0.3,0.7
                                            c0.1,0.2,0.3,0.4,0.8,0.4c10.7,2.1,18.3,8.4,22.9,19C152.1,179.3,153.3,185.8,153.3,193.2z"/>
                        <path style={{
                        fill: `#${defaultColor}`
                    }} d="M191.1,106.2h22.3c0.6,0,1.1,0.2,1.6,0.6c0.4,0.4,0.6,1,0.6,1.6V233c0,0.6-0.2,1.1-0.6,1.6
                                            c-0.4,0.4-1,0.6-1.6,0.6h-21.6c-0.6,0-1.1-0.2-1.6-0.6c-0.4-0.4-0.6-1-0.6-1.6V132c0-0.2-0.1-0.5-0.4-0.7c-0.2-0.2-0.5-0.3-0.7-0.2
                                            l-18.2,5l-0.7,0.2c-1.1,0-1.7-0.7-1.7-2l-0.6-15.9c0-1.2,0.6-2.1,1.7-2.6l19.4-9C189,106.4,189.9,106.2,191.1,106.2z"/>
                    </g>
                </svg>
                <svg
                    id="delete_button"
                    viewBox="0 0 283.5 283.5"
                    onClick={() => {
                        alert(text.confirm_delete_, () => {
                            api.db.deleteAccount(openAccount.id).then(() => fetchAccounts());
                        });
                    }}
                >
                    <path style={{
                        fill: `#${defaultColor}`
                    }} d="M45.2,65.4l27.7,218h137.7l27.7-218H45.2z M114.9,266.6H90L74.2,96.2h32.5L114.9,266.6z M154.2,266.6h-24.9
                                		l-3.8-170.4H158L154.2,266.6z M193.5,266.6h-24.9l8.2-170.4h32.5L193.5,266.6z"/>
                    <rect className="st0" style={{
                        fill: `#${defaultColor}`
                    }} x="32.6" y="16" width="218.4" height="31.9"/>
                    <rect className="st0" style={{
                        fill: `#${defaultColor}`
                    }} x="114.9" width="53.7" height="31.9"/>
                </svg>
            </div>
            <label><span id="name">{text?.account_name_}</span>
                <Input
                    className="name"
                    name="name"
                    ref={nameInput}
                    onInput={(e) => {
                        if (!/^.+$/.test((e.target as HTMLInputElement).value)) {
                            (e.target as HTMLInputElement).value = settings.name;
                        } else {
                            updateSettings({type: 'name', payload: (e.target as HTMLInputElement).value});
                        }
                    }}
                />
            </label>
            <label><span id="interest_rate">{text?.interest_rate_}</span>
                <Input
                    className="name"
                    name="interest_rate"
                    ref={interestRateInput}
                    onInput={(e) => {
                        if (!/^(0|[1-9][0-9]*)$/.test((e.target as HTMLInputElement).value)) {
                            (e.target as HTMLInputElement).value = settings.interest_rate.toString();
                        } else {
                            updateSettings({type: 'interest_rate', payload: (e.target as HTMLInputElement).value});
                        }
                    }}
                />
            </label>
            <div className="contain_two">
                <label><span id="color_span">{text?.theme_color_}</span>
                    <ColorPicker
                        accountId={openAccount.id}
                        onInput={(color) => updateSettings({type: 'theme_color', payload: color})}
                    />
                </label>
                <Checkbox
                    checked={settings.allow_overdrawing}
                    onChange={() => {
                        updateSettings({type: 'allow_overdrawing', payload: !settings.allow_overdrawing})
                    }}
                    label={text.allow_overdrawing_}
                />
            </div>
            <Button onClick={() => {
                api.db.patchAccount(
                    openAccount?.id,
                    settings.name,
                    settings.theme_color,
                    settings.allow_overdrawing,
                    settings.interest_rate
                ).then(fetchAccounts);
            }}>{text?.save_}</Button>
        </div>
    );
}