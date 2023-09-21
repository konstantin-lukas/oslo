import React, { useContext } from "react";
import './AccountTable.scss';
import { TextContext } from "./misc/Contexts";
import styled from "styled-components";

const StyledButton = styled.button`
  background: rgb(${props => props.theme.theme_color.r},${props => props.theme.theme_color.g},${props => props.theme.theme_color.b});
  &.del:hover {
    background: ${props => props.theme.neutral_color};
  }
  &.del::after, &.del::before {
    background: ${props => props.theme.neutral_color};
  }
  &.del:hover::after, &.del:hover::before {
    background: ${props => props.theme.neutral_opposite};
  }
`;

export default function AccountTable({ transactions }: { transactions: Transaction[] }) {
    const text = useContext(TextContext);

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
                    <StyledButton type="button" value={transaction.id} className="del"></StyledButton>
                </td>
            </tr>
        );
    });

    // TODO: Marquee

    return (
        <table className="balanceChangeTable">
            <thead>
            <tr>
                <td colSpan={21} className="balance_row">
                    {text?.balance}:
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
