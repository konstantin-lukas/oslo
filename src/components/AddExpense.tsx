import React, {useContext, useEffect, useRef, useState} from "react";
import './AddExpense.scss';
import IntlCurrencyInput from "intl-currency-input";
import {DisplayOrder} from "moneydew";
import {TextContext} from "./misc/Contexts";
import Button from "./Button";
import Input from "./Input";

export default function AddExpense({openAccount, fetchTransactions}: {
    openAccount: AccountData,
    fetchTransactions: () => void;
}) {
    const currencyInputElement = useRef<HTMLInputElement | null>(null);
    const [currencyInput, setCurrencyInput] = useState<IntlCurrencyInput | null>(null);
    const text = useContext(TextContext);
    const titleInput = useRef(null);
    useEffect(() => {
        const input = currencyInputElement.current;
        if (input) {
            if (currencyInput) {
                currencyInput.unmount();
            }
            const newInput = new IntlCurrencyInput(input, '0.00', {
                currencyName: 'EUR',
                currencySymbol: '€',
                groupSeparator: ' ',
                decimalSeparator: ',',
                displayOrder: DisplayOrder.NAME_SIGN_NUMBER_SYMBOL,
            });
            setCurrencyInput(newInput);
        } else {
            setCurrencyInput(null);
        }
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
            <Button onClick={() => {
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