import React, {useContext, useState} from "react";
import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import {AlertContext, TextContext} from "./misc/Contexts";
import {useTheme} from "styled-components";
import CurrencyInput from "./CurrencyInput";
const executionDayLablesAndValues = [
    "1","2","3","4","5","6","7","8","9","10",
    "11","12","13","14","15","16","17","18","19","20",
    "21","22","23","24","25","26","27","28","29","30","31"
];

export default function StandingOrder({data, currency, intervalLabels, intervalValues, account, setStandingOrders}: {
    data: StandingOrder,
    currency: string,
    intervalLabels: string[],
    intervalValues: string[],
    account: number,
    setStandingOrders: (orders: StandingOrder[]) => void
}) {
    const theme = useTheme()
    const text = useContext(TextContext);
    const [amount, setAmount] = useState(data.sum);
    const [name, setName] = useState(data.title);
    const [execOn, setExecOn] = useState(data.exec_on);
    const [execInterval, setExecInterval] = useState(data.exec_interval);

    const alertCtx = useContext(AlertContext);
    return (
        <div className="standing_order">
            <label className="heading">
                <span className="label_name">{text.standing_order_name_}</span>
                <Input
                    defaultValue={data.title}
                    onInput={e => {
                        if (!/^.+$/.test((e.target as HTMLInputElement).value)) {
                            (e.target as HTMLInputElement).value = name;
                        } else {
                            setName((e.target as HTMLInputElement).value);
                        }
                    }}
                />
            </label>
            <label><span className="label_name">{text.amount_} ({currency})</span>
                <CurrencyInput value={amount} setValue={setAmount}/>
            </label>
            <label className="dot">
                <span className="label_name">{text.day_of_execution_}</span>
                <Dropdown
                    labels={executionDayLablesAndValues}
                    values={executionDayLablesAndValues}
                    defaultSelected={data.exec_on.toString()}
                    returnValue={val => setExecOn(parseInt(val))}
                />
            </label>
            <label className="int">
                <span className="label_name">{text.exec_interval_}</span>
                <Dropdown
                    labels={intervalLabels}
                    values={intervalValues}
                    defaultSelected={data.exec_interval.toString()}
                    returnValue={val => setExecInterval(parseInt(val))}
                />
            </label>
            <div className="contain_two">
                <Button altColors={theme.neutral_color === '#ffffff'} onClick={() => {
                    api.db.patchStandingOrder(data.id, name, amount, execInterval, execOn).then(() => {
                        alertCtx(
                            text.changes_saved_,
                            () => {}
                        );
                    });
                }}>{text.save_}</Button>
                <Button altColors={theme.neutral_color === '#ffffff'} onClick={() => {
                    alertCtx(
                        text.confirm_standing_order_delete_,
                        () => {
                            api.db.deleteStandingOrder(data.id).then(() => {
                                api.db.getStandingOrders(account).then(res => {
                                    setStandingOrders(res);
                                });
                            })
                        },
                        () => {}
                    );
                }}>{text.delete_}</Button>
            </div>
        </div>
    )
}