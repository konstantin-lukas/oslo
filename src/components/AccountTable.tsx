import React from "react";
import './AccountTable.scss';
export default function AccountTable({transactions}: {transactions: Transaction[]}) {
    const rows = transactions.map(transaction => {
        const className = "balanceChange" + (transaction.sum[0] === '-' ? " expense" : "proceed");
        return (
            <tr className={className} key={transaction.id}>
                <td colSpan={5}>
                    <span>{transaction.sum}</span>
                </td>
                <td colSpan={10}>{transaction.title}</td>
                <td colSpan={5}>{transaction.date}</td>
                <td colSpan={1} className="delRow">
                    <button type="button" value={transaction.id} className="del theme_background"></button>
                </td>
            </tr>
        );
    });

   return (
        <table className="balanceChangeTable">
            <thead>
                <tr>
                    <td colSpan={21} className="balance_row">
                        Account balance:
                        <span style={{
                            marginRight: '.25em',
                            color: true ? 'green' : 'red' // TODO
                        }}> -EUR 573.42 </span>
                        (<span title="Selected time span" style={{
                            color: true ? 'green' : 'red' // TODO
                        }}>-EUR 28.87</span>)
                    </td>
                </tr>
                <tr className="headingRow">
                    <td colSpan={5}>Amount</td>
                    <td colSpan={10}>Reference</td>
                    <td colSpan={5}>Date</td>
                    <td colSpan={1} className="delRow"></td>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}