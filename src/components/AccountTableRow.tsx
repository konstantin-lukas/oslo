import React, {useContext, useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {styled, ThemeContext} from "styled-components";
import {AlertContext, CurrencyContext, LanguageContext, TextContext} from "./misc/Contexts";
import './AccountTableRow.scss';
import {useDefer} from "anzol";
import CurrencyInput from "./CurrencyInput";

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
export default function AccountTableRow({id, sum, title, timestamp, category, fetchTransactions}: {
    id: number,
    sum: string,
    title: string,
    timestamp: string,
    category: string,
    fetchTransactions: () => void
}) {
    const language = useContext(LanguageContext);
    const currency = useContext(CurrencyContext);
    const alert = useContext(AlertContext);
    const text = useContext(TextContext);
    const theme = useContext(ThemeContext);

    const date = new Date(timestamp).toLocaleDateString(language.code);
    const [transactionTitle, setTransactionTitle] = useState(title);
    const [transactionCategory, setTransactionCategory] = useState(category);
    const [transactionSum, setTransactionSum] = useState(sum);
    const [showModal, setShowModal] = useState(false);
    const [showModalTimeout, setShowModalTimeout] = useState<NodeJS.Timeout>();
    const isMountingRef = useRef(false);
    const deferredTitle = useDefer(transactionTitle, 800);
    const deferredCategory = useDefer(transactionCategory, 800);
    const deferredSum = useDefer(transactionSum, 800);
    useEffect(() => {
        isMountingRef.current = true;
    }, []);
    useEffect(() => {
        if (!isMountingRef.current) {
            api.db.patchTransaction(transactionTitle, transactionSum, id, transactionCategory).then(() => {
                setShowModal(true);
                if (showModalTimeout) clearTimeout(showModalTimeout);
                setShowModalTimeout(setTimeout(() => setShowModal(false), 1000));
                fetchTransactions();
            });
        } else {
            isMountingRef.current = false;
        }
    }, [deferredTitle, deferredCategory, deferredSum]);
    return (
        <tr className={"balanceChange" + (transactionSum[0] === '-' ? " expense" : " proceed")}>
            <td colSpan={4} title={transactionSum}>
                <span><CurrencyInput
                    setValue={setTransactionSum}
                    value={transactionSum}
                    customFormat={{
                        displayOrder: language.format.displayOrder,
                        currencySymbol: currency.symbol,
                        symbolSeparator: language.format.symbolSeparator,
                        currencyName: '',
                        negativeSign: '-',
                        positiveSign: '+'
                    }}
                /></span>
            </td>
            <td colSpan={10} title={title ?? text.not_set_}>
                <input type="text" placeholder={text.not_set_} value={transactionTitle ?? ""} onInput={(e) => {
                    setTransactionTitle((e.target as HTMLInputElement).value);
                }}/>
            </td>
            <td colSpan={10} title={category ?? text.not_set_}>
                <input type="text" placeholder={text.not_set_} value={transactionCategory ?? ""} onInput={(e) => {
                    setTransactionCategory((e.target as HTMLInputElement).value);
                }}/>
            </td>
            <td colSpan={4} title={date}>{date}</td>
            <td colSpan={1} className="delRow">
                <StyledButton
                    type="button"
                    className="del"
                    onClick={() => {
                        alert(
                            text.confirm_transaction_delete_,
                            () => {
                                api.db.deleteTransaction(id).then(() => fetchTransactions())
                            },
                            () => {
                            }
                        );
                    }}
                ></StyledButton>
            </td>
            {showModal && createPortal(
                <div className="changes-saved-modal" style={{
                    backgroundColor: theme.theme_color,
                    color: theme.neutral_color
                }}>
                    <span>{text.changes_saved_}</span>
                </div>,
                document.body
            )}
        </tr>
    );
}