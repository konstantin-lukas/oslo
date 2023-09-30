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

export default function StandingOrder({data, currency, intervalLabels, intervalValues, zIndex, account, setStandingOrders}: {
    data: StandingOrder,
    currency: string,
    intervalLabels: string[],
    intervalValues: string[],
    zIndex: number,
    account: number,
    setStandingOrders: (orders: StandingOrder[]) => void
}) {
    const theme = useTheme()
    const text = useContext(TextContext);
    const [amount, setAmount] = useState(data.sum);
    const alertCtx = useContext(AlertContext);
    return (
        <div className="standing_order">
            <label className="heading">
                <span className="label_name">{text.standing_order_name_}</span>
                <Input defaultValue={data.title}/>
            </label>
            <label><span className="label_name">{text.amount_} ({currency})</span>
                <CurrencyInput value={amount} setValue={setAmount}/>
            </label>
            <label className="dot" style={{ zIndex: zIndex }}>
                <span className="label_name">{text.day_of_execution_}</span>
                <Dropdown
                    labels={executionDayLablesAndValues}
                    values={executionDayLablesAndValues}
                    defaultSelected={data.exec_on.toString()}
                    returnValue={() => {}}
                />
            </label>
            <label className="int" style={{ zIndex: zIndex - 1 }}>
                <span className="label_name">{text.exec_interval_}</span>
                <Dropdown
                    labels={intervalLabels}
                    values={intervalValues}
                    defaultSelected={data.exec_interval.toString()}
                    returnValue={() => {}}
                />
            </label>
            <div className="contain_two">
                <Button altColors={theme.neutral_color === '#ffffff'} onClick={() => undefined}>{text.save_}</Button>
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