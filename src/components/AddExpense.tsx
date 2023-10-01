import React, {useContext, useRef, useState} from "react";
import './AddExpense.scss';
import {AlertContext, LightModeContext, TextContext} from "./misc/Contexts";
import Button from "./Button";
import Input from "./Input";
import {useTheme} from "styled-components";
import CurrencyInput from "./CurrencyInput";
import {Money, MoneyCalculator} from "moneydew";

export default function AddExpense({openAccount, fetchTransactions}: {
    openAccount: AccountData,
    fetchTransactions: () => void;
}) {
    const text = useContext(TextContext);
    const lightMode = useContext(LightModeContext);
    const alertCtx = useContext(AlertContext);
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
                onClick={async () => {
                    const balance = new Money(await api.db.getBalance(openAccount.id));
                    const transactionAmount = new Money(amount);
                    console.log(balance, transactionAmount)
                    MoneyCalculator.add(balance, transactionAmount);
                    if (balance.isNegative) {
                        alertCtx(
                            text.cannot_overdraw_,
                            () => {}
                        );
                    } else {
                        const title = titleInput?.current?.value;
                        api.db.postTransaction(title, amount, openAccount?.id).then(() => {
                            setAmount('0.00');
                            titleInput.current.value = '';
                            fetchTransactions();
                        });
                    }
                }}
            >{text?.add_}</Button>
        </div>
    );
}