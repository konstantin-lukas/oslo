import React, {useContext, useRef, useState} from "react";
import './AddExpense.scss';
import {LightModeContext, TextContext} from "./misc/Contexts";
import Button from "./Button";
import Input from "./Input";
import {useTheme} from "styled-components";
import CurrencyInput from "./CurrencyInput";

export default function AddExpense({openAccount, fetchTransactions}: {
    openAccount: AccountData,
    fetchTransactions: () => void;
}) {
    const text = useContext(TextContext);
    const lightMode = useContext(LightModeContext);
    const theme = useTheme();
    const titleInput = useRef(null);
    const [amount, setAmount] = useState('0.00');

    return (
        <div id="addExpense">
            <h2>{text?.transaction_}</h2>
            <label><span id="amount">{text?.amount_}</span>
                <CurrencyInput
                    setValue={setAmount}
                    value={amount}
                />
            </label>
            <label><span id="title">{text?.reference_}</span>
                <Input ref={titleInput} className="title" name="title"/>
            </label>
            <Button
                altColors={theme.neutral_color === '#ffffff' && lightMode}
                onClick={() => {
                const title = titleInput?.current?.value;
                api.db.postTransaction(title, amount, openAccount?.id).then(() => {
                    setAmount('0.00');
                    titleInput.current.value = '';
                    fetchTransactions();
                });

            }}>{text?.confirm_}</Button>
        </div>
    );
}