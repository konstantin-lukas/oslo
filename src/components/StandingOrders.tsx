import React, {useCallback, useContext, useEffect, useMemo, useReducer, useState} from "react";
import anime from 'animejs';
import './StandingOrders.scss';
import {useTheme} from "styled-components";
import {AlertContext, FetchAccountsContext, LanguageContext, TextContext} from "./misc/Contexts";
import Dropdown from "./Dropdown";
import Input from "./Input";
import Checkbox from "./Checkbox";
import Button from "./Button";
import CurrencyInput from "./CurrencyInput";
import {formatDate} from "./misc/Format";
import {sub, lastDayOfMonth, formatISO, setDate} from "date-fns";
import DatePicker from "react-datepicker";
import StandingOrder from "./StandingOrder";

function addOrderReducer(state: any, action: {type: string, payload: any}) {
    const obj = {
        ...state
    }
    if (action.payload instanceof Date) {
        obj[action.type] = formatISO(action.payload, {representation: 'date'})
    } else {
        obj[action.type] = action.type === 'exec_interval' ? parseInt(action.payload) : action.payload;
    }
    return obj;
}

export default function StandingOrders({closeStandingOrders, openAccount}: {
    closeStandingOrders: () => void,
    openAccount: AccountData
}) {

    const theme = useTheme();
    const text = useContext(TextContext);
    const lang = useContext(LanguageContext);
    const alertCtx = useContext(AlertContext);
    const fetchCtx = useContext(FetchAccountsContext);
    const intervalLabels = useMemo(() => [
        text.every_1_,
        text.every_2_,
        text.every_3_,
        text.every_4_,
        text.every_5_,
        text.every_6_,
        text.every_7_,
        text.every_8_,
        text.every_9_,
        text.every_10_,
        text.every_11_,
        text.every_12_,
    ], [text]);
    const intervalValues = useMemo(() => ["1","2","3","4","5","6","7","8","9","10","11","12"], []);

    const [addOrderState, setAddOrderState] = useReducer(addOrderReducer, {
        name: '',
        amount: '0.00',
        first_execution: new Date().toISOString().split('T')[0],
        exec_interval: 1,
        exec_on_last_of_month: false
    });
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [isUsingDefaultName, setIsUsingDefaultName] = useState(true);
    const [standingOrders, setStandingOrders] = useState([]);
    const standingOrderElements = useMemo(() => {
        if (standingOrders.length === 0) {
            return <label>{text.no_standing_orders_}</label>
        } else {
            return standingOrders.map(order => (
                <StandingOrder
                    key={order.id}
                    data={order}
                    currency={openAccount.currency}
                    intervalLabels={intervalLabels}
                    intervalValues={intervalValues}
                    account={openAccount.id}
                    setStandingOrders={setStandingOrders}
                />
            ));
        }
    }, [standingOrders]);

    useEffect(() => {
        api.db.getStandingOrders(openAccount.id).then(res => setStandingOrders(res));
    }, [openAccount]);

    useEffect(() => {
        if (isUsingDefaultName)
            setAddOrderState({type: 'name', payload: text.account_name_})
    }, [text]);

    const backAnim = useCallback((path: string, target: string) => {
        anime({
            targets: target,
            points: path,
            easing: 'cubicBezier(0,.5,.56,1.01)',
            duration: 200,
            loop: false,
            complete: function () {
                this.reverse();
            }
        });
    }, []);

    return (
        <div id="standing_orders">
            <svg viewBox="0 0 283.5 283.5" id="back_btn"
                 onClick={closeStandingOrders}
                 onMouseOver={() => backAnim('165.1,115.5 270.4,115.5 270.4,168 165.1,168 165.1,168 112.6,168 112.6,230 13.1,141.7 13.1,141.7 112.6,53.5 112.6,115.5 165.1,115.5','#back_btn .st0')}
                 onMouseLeave={() => backAnim('178.9,141.7 271.7,234.5 234.5,271.7 141.7,178.9 48.9,271.7 11.8,234.5 104.6,141.7 11.8,48.9 48.9,11.8 141.7,104.6 234.5,11.8 271.7,48.9','#back_btn .st0')}
            >
                <polygon
                    style={{fill: theme.theme_color}}
                    className="st0"
                    points="178.9,141.7 271.7,234.5 234.5,271.7 141.7,178.9 48.900000000000006,271.7 11.799999999999997,234.5 104.6,141.7 11.8,48.900000000000006 48.9,11.800000000000011 141.7,104.6 234.5,11.799999999999997 271.7,48.900000000000006 "
                ></polygon>
            </svg>
            <div id="order_wrapper">
                <div id="add_order" className="theme_background">
                    <h2>{text.create_standing_order_}</h2>
                    <input type="hidden"/>
                    <label className="export_label" id="name_label">
                        <span className="label_name">{text.standing_order_name_}</span>
                        <Input onInput={e => {
                            if (!/^.+$/.test((e.target as HTMLInputElement).value)) {
                                (e.target as HTMLInputElement).value = addOrderState.name;
                            } else {
                                setAddOrderState({type: 'name', payload: (e.target as HTMLInputElement).value});
                                setIsUsingDefaultName(false);
                            }
                        }}
                        defaultValue={addOrderState.name}/>
                    </label>
                    <label className="export_label" id="amount_label">
                        <span className="label_name">{text.amount_}</span>
                        <CurrencyInput
                            setValue={(val: string) => setAddOrderState({type: 'amount', payload: val})}
                            value={addOrderState.amount}
                        />
                    </label>
                    <label className="export_label" id="exec_date_label">
                        <span className="label_name">{text.first_execution_}</span>
                        <Input
                            readOnly={true}
                            onClick={() => setDatePickerOpen(true)}
                            value={formatDate(lang, new Date(addOrderState.first_execution))}
                        />
                    </label>
                    <label className="export_label" id="interval_select">
                        <span className="label_name">{text.exec_interval_}</span>
                        <Dropdown
                            labels={intervalLabels}
                            values={intervalValues}
                            defaultSelected={"1"}
                            returnValue={(val) => setAddOrderState({type: 'exec_interval', payload: val})}
                            compact={false}
                        />
                    </label>
                    <label className="export_label" id="exec_on_last">
                        <Checkbox
                            onChange={() => setAddOrderState({type: 'exec_on_last_of_month', payload: !addOrderState.exec_on_last_of_month})}
                            checked={addOrderState.exec_on_last_of_month}
                            label={text.exec_on_last_day_of_month_}
                        />
                    </label>
                    <Button
                        altColors={theme.neutral_color === '#ffffff'}
                        onClick={() => {
                        const first_exec = addOrderState.first_execution;
                        const exec_on = addOrderState.exec_on_last_of_month
                            ? 31
                            : parseInt(first_exec.substring(8));
                        let first_exec_date = new Date(first_exec);
                        if (addOrderState.exec_on_last_of_month)
                            first_exec_date = setDate(first_exec_date, lastDayOfMonth(first_exec_date).getDate());
                        let last_exec = sub(first_exec_date, {
                            months: addOrderState.exec_interval
                        });
                        if (addOrderState.exec_on_last_of_month) {
                            last_exec = lastDayOfMonth(last_exec);
                        }
                            api.db.postStandingOrder(
                            openAccount.id,
                            addOrderState.name,
                            addOrderState.amount,
                            addOrderState.exec_interval,
                            exec_on,
                            formatISO(last_exec, {representation: 'date'})
                        ).then(() => {
                            api.db.executeStandingOrders().then(() => {
                                api.db.getStandingOrders(openAccount.id).then(res => {
                                    setStandingOrders(res);
                                    alertCtx(
                                        text.changes_saved_,
                                        () => {}
                                    );
                                });
                                fetchCtx();
                            });
                        });
                        }}>{text.create_standing_order_}</Button>
                </div>
                <div id="manage_orders" className="theme_background">
                    <h2>{text.manage_standing_orders_}</h2>
                    {standingOrderElements}
                </div>
            </div>
            <div className={(datePickerOpen ? 'left_open' : '') + " dateTimePickerContainer"}>
                <DatePicker
                    onChange={() => {}}
                    onSelect={(pickedDate) => {
                        setAddOrderState({type: 'first_execution', payload: pickedDate});
                        setDatePickerOpen(false);
                    }}
                    onClickOutside={() => {setDatePickerOpen(false)}}
                    minDate={new Date()}
                    locale={lang}
                    selected={new Date(addOrderState.first_execution)}
                    inline/>
            </div>
        </div>
    );
}