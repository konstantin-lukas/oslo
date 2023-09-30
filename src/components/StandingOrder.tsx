import React, {useContext} from "react";
import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import {TextContext} from "./misc/Contexts";
import {useTheme} from "styled-components";
const executionDayLablesAndValues = [
    "1","2","3","4","5","6","7","8","9","10",
    "11","12","13","14","15","16","17","18","19","20",
    "21","22","23","24","25","26","27","28","29","30","31"
];

export default function StandingOrder({data, currency, intervalLabels, intervalValues}: {
    data: StandingOrder,
    currency: string,
    intervalLabels: string[],
    intervalValues: string[]
}) {
    const theme = useTheme()
    const text = useContext(TextContext);
    return (
        <div className="standing_order">
            <label className="heading">
                <span className="label_name">{text.standing_order_name_}</span>
                <Input/>
            </label>
            <label><span className="label_name">{text.amount_} ({currency})</span>
                <Input/>
            </label>
            <label className="dot">
                <span className="label_name">{text.day_of_execution_}</span>
                <Dropdown
                    labels={executionDayLablesAndValues}
                    values={executionDayLablesAndValues}
                    defaultSelected={data.exec_on === 32 ? '31' : data.exec_on.toString()}
                    returnValue={() => {}}
                />
            </label>
            <label className="int" >
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
                <Button altColors={theme.neutral_color === '#ffffff'} onClick={() => undefined}>{text.delete_}</Button>
            </div>
        </div>
    )
}