import React, {useContext, useMemo} from "react";
import {styled} from "styled-components";
import {AlertContext, CurrencyContext, LanguageContext, TextContext} from "./misc/Contexts";
import './AccountTableRow.scss';
import {Money, MoneyFormatter} from "moneydew";

const StyledButton = styled.button`
  background: ${props => props.theme.theme_color};
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
    const currency = useContext(CurrencyContext);
    const alert = useContext(AlertContext);
    const text = useContext(TextContext);

    const className = "balanceChange" + (sum[0] === '-' ? " expense" : " proceed");
    const date = new Date(timestamp).toLocaleDateString(language.code);
    const formattedSum = useMemo(() => {
        return new MoneyFormatter({
            displayOrder: language.display_order,
            currencySymbol: currency.symbol,
            currencyName: '',
            negativeSign: '-',
            positiveSign: '+'
        }).format(new Money(sum));
    }, [sum, language, currency]);
    return (
        <tr className={className}>
            <td colSpan={5} title={formattedSum}>
                <span>{formattedSum}</span>
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
                            () => {api.db.deleteTransaction(id).then(() => fetchTransactions())},
                            () => {}
                        );
                    }}
                ></StyledButton>
            </td>
        </tr>
    );
}