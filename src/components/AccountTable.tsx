import React, {useContext, useEffect, useState} from "react";
import './AccountTable.scss';
import { TextContext } from "./misc/Contexts";
import AccountTableRow from "./AccountTableRow";

export default function AccountTable({ transactions, openAccount, triggerFetch }: {
    transactions: Transaction[],
    openAccount: AccountData,
    triggerFetch: () => void;
}) {
    const text = useContext(TextContext);
    const [balance, setBalance] = useState<string>('0.00');

    useEffect(() => {
        api.getBalance(openAccount?.id).then(sum => {
            setBalance(sum || '0.00');
        });
    }, [openAccount, transactions]);

    const rows = transactions.map(transaction => {
        return (
            <AccountTableRow
                key={transaction.id}
                id={transaction.id}
                sum={transaction.sum}
                title={transaction.title}
                timestamp={transaction.timestamp}
                triggerFetch={triggerFetch}
            />
        );
    });

    return (
        <table className="balanceChangeTable">
            <thead>
            <tr>
                <td colSpan={21} className="balance_row">
                    {text?.balance}:
                    <span style={{
                        marginRight: '.25em',
                        color: balance[0] === '-' ? 'red' : 'green'
                    }}> {balance}</span>
                    (<span title="Selected time span" style={{
                    color: true ? 'green' : 'red' // TODO
                }}>-EUR 28.87</span>)
                </td>
            </tr>
            <tr className="headingRow">
                <td colSpan={5}>{text?.amount}</td>
                <td colSpan={10}>{text?.reference}</td>
                <td colSpan={5}>{text?.date}</td>
                <td colSpan={1} className="delRow"></td>
            </tr>
            </thead>
            <tbody>
            {rows}
            </tbody>
        </table>
    );
}
