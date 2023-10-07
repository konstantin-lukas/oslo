import React, {useContext, useEffect, useMemo, useState} from "react";
import './NoAccounts.scss';
import Dropdown from "./Dropdown";
import currencies from "./misc/Currencies";
import {FetchAccountsContext, LanguageContext, LightModeContext, TextContext} from "./misc/Contexts";
import Input from "./Input";
import Button from "./Button";

export default function NoAccounts() {
    const lang = useContext(LanguageContext);
    const text = useContext(TextContext);
    const fetchAccounts = useContext(FetchAccountsContext);
    const lightMode = useContext(LightModeContext);
    const [currency, setCurrency] = useState('USD');
    const [name, setName] = useState<string>(text?.new_account_);
    const [defaultName, setDefaultName] = useState(true);
    const labels = useMemo(() => {
        return currencies.map((currency) => {
            return currency + " (" + new Intl.DisplayNames([lang.code], { type: 'currency' }).of(currency) + ")"
        })
    }, [lang]);

    useEffect(() => {
        if (defaultName)
            setName(text.new_account_);
    }, [text]);

    return <div id="no_accounts">
        <span className="message">{text?.pick_name_and_currency_}<br/><span style={{color: '#808080'}}>{text?.caution_currency_perma_}</span></span>
        <div className="container">
            <Dropdown labels={labels} values={currencies} defaultSelected={'USD'} returnValue={value=> {
                setCurrency(value);
            }}/>
            <Input
                id="accountName"
                value={name}
                onInput={(e) => {
                    if (!/^.+$/.test((e.target as HTMLInputElement).value)) {
                        (e.target as HTMLInputElement).value = name;
                    } else {
                        setName((e.target as HTMLInputElement).value);
                        setDefaultName(false);
                    }
                }}
            />
            <Button
                altColors={true}
                onClick={() => {
                if (!name) return;
                api.db.postAccount(
                    name,
                    currency,
                    false,
                    lightMode ? '1a1a1a' : 'ffffff',
                    new Date().getFullYear() - 1
                ).then(() => fetchAccounts('last'));
            }}>{text?.confirm_}</Button>
        </div>
    </div>
}