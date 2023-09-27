import React, {useContext, useEffect, useMemo, useState} from "react";
import './NoAccounts.scss';
import Dropdown from "./Dropdown";
import currencies from "./misc/Currencies";
import {FetchAccountsContext, LanguageContext, TextContext} from "./misc/Contexts";
import Input from "./Input";
import Button from "./Button";

export default function NoAccounts() {
    const lang = useContext(LanguageContext);
    const text = useContext(TextContext);
    const fetchAccounts = useContext(FetchAccountsContext);
    const [currency, setCurrency] = useState('USD');
    const [name, setName] = useState<string>(text?.new_account_);
    const labels = useMemo(() => {
        return currencies.map((currency) => {
            return currency + " (" + new Intl.DisplayNames([lang], { type: 'currency' }).of(currency) + ")"
        })
    }, []);

    useEffect(() => {
        if (text)
            setName(text.new_account_)
    }, [text]);

    return <div id="no_accounts">
        <span className="message">{text?.pick_name_and_currency_}</span>
        <div className="container">
            <Dropdown labels={labels} values={currencies} defaultSelected={'USD'} returnValue={value=> {
                setCurrency(value);
            }}/>
            <Input
                id="accountName"
                defaultValue={name}
                onInput={(e) => {
                    if (!/^.+$/.test((e.target as HTMLInputElement).value)) {
                        (e.target as HTMLInputElement).value = name;
                    } else {
                        setName((e.target as HTMLInputElement).value);
                    }
                }}
            />
            <Button onClick={() => {
                if (!name) return;
                api.db.postAccount(
                    name,
                    currency,
                    false,
                    'ffffff',
                    new Date().getFullYear() - 1
                ).then(fetchAccounts);
            }}>{text?.confirm_}</Button>
        </div>
    </div>
}