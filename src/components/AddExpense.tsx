import React, {useContext, useEffect, useState} from "react";
import './AddExpense.scss';
import {AlertContext, CurrencyContext, LightModeContext, TextContext} from "./misc/Contexts";
import Button from "./Button";
import Input from "./Input";
import {useTheme} from "styled-components";
import CurrencyInput from "./CurrencyInput";
import {Money, MoneyCalculator} from "moneydew";
import {getZeroValue} from "./misc/Format";

export default function AddExpense({openAccount, fetchTransactions}: {
    openAccount: AccountData,
    fetchTransactions: () => void;
}) {
    const text = useContext(TextContext);
    const lightMode = useContext(LightModeContext);
    const alertCtx = useContext(AlertContext);
    const currency = useContext(CurrencyContext);
    const theme = useTheme();
    const [amount, setAmount] = useState(getZeroValue(currency.decimalPlaces));
    const [category, setCategory] = useState<null | string>(null);
    const [transactionName, setTransactionName] = useState(text.new_transaction_);
    const [defaultName, setDefaultName] = useState(true);
    useEffect(() => {
        setAmount(getZeroValue(currency.decimalPlaces));
    }, [currency]);
    useEffect(() => {
        if (defaultName)
            setTransactionName(text.new_transaction_);
    }, [text]);
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
                <Input
                    className="title"
                    name="title"
                    value={transactionName}
                    onInput={e => {
                        setTransactionName((e.target as HTMLInputElement).value);
                        setDefaultName(false);
                    }}
                />
            </label>
            <label><span id="category">{text?.category_}</span>
                <Input
                    className="title"
                    name="title"
                    value={category ?? ""}
                    onInput={e => {
                        const value = (e.target as HTMLInputElement).value;
                        setCategory(value === "" ? null : value);
                    }}
                />
            </label>
            <Button
                altColors={theme.neutral_color === '#ffffff' && lightMode}
                onClick={async () => {
                    const balance = new Money(await api.db.getBalance(openAccount.id));
                    const transactionAmount = new Money(amount);
                    MoneyCalculator.add(balance, transactionAmount);
                    if (!openAccount.allow_overdrawing && transactionAmount.isNegative && balance.isNegative) {
                        alertCtx(
                            text.cannot_overdraw_,
                            () => {
                            }
                        );
                    } else {
                        api.db.postTransaction(transactionName, amount, openAccount?.id, category).then(() => {
                            setAmount(getZeroValue(currency.decimalPlaces));
                            setTransactionName(text.new_transaction_);
                            setCategory(null);
                            setDefaultName(true);
                            fetchTransactions();
                        });
                    }
                }}
            >{text?.add_}</Button>
        </div>
    );
}