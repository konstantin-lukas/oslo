import React, {useContext} from "react";
import './NoAccounts.scss';
import Dropdown from "./Dropdown";
import currencies from "./misc/Currencies";
import {LanguageContext, TextContext} from "./misc/Contexts";
import Input from "./Input";

export default function NoAccounts() {
    const lang = useContext(LanguageContext);
    const text = useContext(TextContext);

    const options = currencies.map(currency => currency + " (" +new Intl.DisplayNames([lang], { type: 'currency' }).of(currency) + ")");
    return <div id="no_accounts">
        <div className="container">
            <span className="message">
                {text?.pick_name_and_currency_}
            </span>
            <Dropdown options={options} selected={138}/>
            <Input id="accountName"/>
        </div>
    </div>
}