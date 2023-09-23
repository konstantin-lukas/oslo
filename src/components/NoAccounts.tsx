import React, {useContext, useRef, useState} from "react";
import './NoAccounts.scss';
import Dropdown from "./Dropdown";
import currencies from "./misc/Currencies";
import {LanguageContext, TextContext} from "./misc/Contexts";
import Input from "./Input";
import Button from "./Button";

export default function NoAccounts({fetchAccounts} : {
    fetchAccounts: () => void
}) {
    const lang = useContext(LanguageContext);
    const text = useContext(TextContext);
    const [currency, setCurrency] = useState('USD');
    const input = useRef<HTMLInputElement>(null);

    let index = 0;
    const options = currencies.map((currency, i) => {
        if (currency === 'USD')
            index = i;
        return currency + " (" +new Intl.DisplayNames([lang], { type: 'currency' }).of(currency) + ")"
    });
    return <div id="no_accounts">
        <span className="message">{text?.pick_name_and_currency_}</span>
        <div className="container">
            <Dropdown options={options} defaultSelected={index} returnValue={value=> {
                setCurrency(currencies[value]);
            }}/>
            <Input id="accountName" ref={input}/>
            <Button onClick={() => {
                if (!input?.current) return;
                api.db.postAccount(
                    input.current.value,
                    currency,
                    false,
                    'ffffff',
                    new Date().getFullYear() - 1
                ).then(fetchAccounts);
            }}>{text?.confirm_}</Button>
        </div>
    </div>
}