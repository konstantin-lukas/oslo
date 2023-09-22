import React, {useContext} from "react";
import styled from "styled-components";
import {AlertContext, LanguageContext, TextContext} from "./misc/Contexts";
import './AccountTableRow.scss';

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
export default function AccountTableRow({id, sum, title, timestamp, fetchTransactions}: {
    id: number,
    sum: string,
    title: string,
    timestamp: string,
    fetchTransactions: () => void
}) {
    const language = useContext(LanguageContext);
    const alert = useContext(AlertContext);
    const text = useContext(TextContext);

    const className = "balanceChange" + (sum[0] === '-' ? " expense" : " proceed");
    const date = new Date(timestamp).toLocaleDateString(language);
    sum = (sum[0] === '-' ? '' : '+') + sum;
    return (
        <tr className={className}>
            <td colSpan={5} title={sum}>
                <span>{sum}</span>
            </td>
            <td colSpan={10} title={title}>{title}</td>
            <td colSpan={5} title={date}>{date}</td>
            <td colSpan={1} className="delRow">
                <StyledButton
                    type="button"
                    className="del"
                    onClick={() => {
                        alert(
                            text.confirm_transaction_delete_,
                            () => {api.deleteTransaction(id).then(() => fetchTransactions())}
                        );
                    }}
                ></StyledButton>
            </td>
        </tr>
    );
}