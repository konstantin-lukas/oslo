import React, {useCallback, useContext} from "react";
import anime from 'animejs';
import './StandingOrders.scss';
import {useTheme} from "styled-components";
import {TextContext} from "./misc/Contexts";
import Dropdown from "./Dropdown";
import Input from "./Input";
import Checkbox from "./Checkbox";
import Button from "./Button";
export default function StandingOrders({closeStandingOrders}: {closeStandingOrders: () => void}) {

    const theme = useTheme();
    const text = useContext(TextContext);

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

    // TODO BETRAG MIT CURRENCY INPUT

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
                        <Input/>
                    </label>
                    <label className="export_label" id="amount_label">
                        <span className="label_name">{text.amount_}</span>
                        <Input/>
                    </label>
                    <label className="export_label" id="exec_date_label">
                        <span className="label_name">{text.first_execution_}</span>
                        <Input/>
                    </label>
                    <label className="export_label" id="interval_select">
                        <span className="label_name">{text.exec_interval_}</span>
                        <Dropdown
                            labels={[
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
                            ]}
                            values={["1","2","3","4","5","6","7","8","9","10","11","12"]}
                            defaultSelected={"1"}
                            returnValue={() => undefined}
                            compact={false}
                        />
                    </label>
                    <label className="export_label" id="exec_on_last">
                        <Checkbox onChange={() => undefined} checked={false} label={text.exec_on_last_day_of_month_}/>
                    </label>
                    <Button onClick={() => {}}>{text.create_standing_order_}</Button>
                </div>
                <div id="manage_orders" className="theme_background">
                    <h2>Daueraufträge verwalten</h2>
                </div>
            </div>
        </div>
    );
}