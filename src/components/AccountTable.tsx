import React, {useContext, useEffect, useState} from "react";
import './AccountTable.scss';
import {TextContext} from "./misc/Contexts";
import AccountTableRow from "./AccountTableRow";
import {Money, MoneyCalculator} from "moneydew";

export default function AccountTable({ transactions, openAccount, fetchTransactions }: {
    transactions: Transaction[],
    openAccount: AccountData,
    fetchTransactions: () => void;
}) {
    const text = useContext(TextContext);
    const [balance, setBalance] = useState<string>('0.00');
    const [timeSpanBalance, setTimeSpanBalance] = useState<string>('0.00');

    useEffect(() => {
        api.db.getBalance(openAccount?.id).then(sum => {
            setBalance(sum || '0.00');
        });

        const timeSpanNetChange: Money = transactions.reduce((previousValue, currentValue) => {
            return MoneyCalculator.add(previousValue, new Money(currentValue.sum));
        }, new Money('0.00'));
        setTimeSpanBalance(timeSpanNetChange.value);
    }, [transactions]);

    const rows = transactions.map(transaction => {
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
                    }}> {balance}</span>
                    (<span title="Selected time span" style={{
                    color: timeSpanBalance[0] === '-' ? 'red' : 'green'
                }}>{timeSpanBalance}</span>)
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
