import React, {useContext, useEffect, useRef, useState} from "react";
import './AddExpense.scss';
import IntlCurrencyInput from "intl-currency-input";
import {DisplayOrder} from "moneydew";
import {LightModeContext, TextContext} from "./misc/Contexts";
import Button from "./Button";
import Input from "./Input";
import {useTheme} from "styled-components";

export default function AddExpense({openAccount, fetchTransactions}: {
    openAccount: AccountData,
    fetchTransactions: () => void;
}) {
    const currencyInputElement = useRef<HTMLInputElement | null>(null);
    const [currencyInput, setCurrencyInput] = useState<IntlCurrencyInput | null>(null);
    const text = useContext(TextContext);
    const lightMode = useContext(LightModeContext);
    const theme = useTheme();
    const titleInput = useRef(null);


    let mounted = false;
    useEffect(() => {
        const input = currencyInputElement.current;
        if (input && !currencyInput && !mounted) {
            mounted = true;
            const newInput = new IntlCurrencyInput(input, '0.00', {
                currencyName: 'EUR',
                currencySymbol: '€',
                groupSeparator: ' ',
                decimalSeparator: ',',
                displayOrder: DisplayOrder.NAME_SIGN_NUMBER_SYMBOL,
            });
            newInput.enableStrictMode();
            setCurrencyInput(newInput);
        }
    }, []);
    useEffect(() => {
        const input = currencyInputElement.current;
        if (input && currencyInput)
            currencyInput.remount(input);
    }, [currencyInputElement]);

    return (
        <div id="addExpense">
            <h2>{text?.transaction_}</h2>
            <label><span id="amount">{text?.amount_}</span>
                <Input ref={currencyInputElement} className="amount" name="amount"/>
            </label>
            <label><span id="title">{text?.reference_}</span>
                <Input ref={titleInput} className="title" name="title"/>
            </label>
            <Button
                altColors={theme.neutral_color === '#ffffff' && lightMode}
                onClick={() => {
                const sum = currencyInput?.getValue();
                const title = titleInput?.current?.value;
                api.db.postTransaction(title, sum, openAccount?.id).then(() => {
                    currencyInput.setValue('0.00');
                    titleInput.current.value = '';
                    fetchTransactions();
                });

            }}>{text?.confirm_}</Button>
        </div>
    );
}