import React, {useContext, useEffect, useMemo, useState} from "react";
import './AccountTable.scss';
import {CurrencyContext, LanguageContext, TextContext} from "./misc/Contexts";
import AccountTableRow from "./AccountTableRow";
import {Money, MoneyCalculator, MoneyFormatter} from "moneydew";
import {getZeroValue} from "./misc/Format";

export default function AccountTable({ transactions, openAccount, fetchTransactions }: {
    transactions: Transaction[],
    openAccount: AccountData,
    fetchTransactions: () => void;
}) {
    const text = useContext(TextContext);
    const language = useContext(LanguageContext);
    const currency = useContext(CurrencyContext);
    const [balance, setBalance] = useState<string>(getZeroValue(currency.decimalPlaces));
    const [timeSpanBalance, setTimeSpanBalance] = useState<string>(getZeroValue(currency.decimalPlaces));

    const formattedBalance = useMemo(() => {
        return new MoneyFormatter({
            displayOrder: language.display_order,
            currencySymbol: currency.symbol,
            groupSeparator: currency.group_separator,
            decimalSeparator: currency.decimal_separator,
            currencyName: currency.name
        }).format(new Money(balance));
    }, [balance]);

    const formattedTimeSpanBalance = useMemo(() => {
        return new MoneyFormatter({
            displayOrder: language.display_order,
            currencySymbol: currency.symbol,
            groupSeparator: currency.group_separator,
            decimalSeparator: currency.decimal_separator,
            currencyName: currency.name
        }).format(new Money(timeSpanBalance));
    }, [timeSpanBalance]);


    useEffect(() => {
        api.db.getBalance(openAccount?.id).then(sum => {
            setBalance(sum || getZeroValue(currency.decimalPlaces));
        });

        const timeSpanNetChange: Money = transactions.reduce((previousValue, currentValue) => {
            return MoneyCalculator.add(previousValue, new Money(currentValue.sum));
        }, new Money(getZeroValue(currency.decimalPlaces)));
        setTimeSpanBalance(timeSpanNetChange.value);
    }, [transactions]);

    const rows = transactions.length === 0
        ? (
            <tr className="balanceChange">
                <td
                    colSpan={21}
                    style={{whiteSpace: 'normal'}}
                >{text.no_transactions_}</td>
            </tr>
        )
        : transactions.map(transaction => {
        return (
            <AccountTableRow
                key={transaction.id}
                id={transaction.id}
                sum={transaction.sum}
                title={transaction.title}
                timestamp={transaction.timestamp}
                fetchTransactions={fetchTransactions}
            />
        );
    });


    return (
        <table className="balanceChangeTable">
            <thead>
            <tr>
                <td colSpan={21} className="balance_row">
                    {text?.balance_}:
                    <span style={{
                        marginRight: '.25em',
                        color: balance[0] === '-' ? 'red' : 'green'
                    }}> {formattedBalance}</span>
                    (<span title={text.selected_time_span_} style={{
                    color: timeSpanBalance[0] === '-' ? 'red' : 'green'
                }}>{formattedTimeSpanBalance}</span>)
                </td>
            </tr>
            <tr className="headingRow">
                <td colSpan={5}>{text?.amount_}</td>
                <td colSpan={10}>{text?.reference_}</td>
                <td colSpan={5}>{text?.date_}</td>
                <td colSpan={1} className="delRow"></td>
            </tr>
            </thead>
            <tbody>
            {rows}
            </tbody>
        </table>
    );
}
