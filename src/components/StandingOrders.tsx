import React from "react";
import './StandingOrders.scss';
export default function StandingOrders() {
    return (
        <div id="standing_orders">
            <svg viewBox="0 0 283.5 283.5" id="back_btn">
                <polygon className="st0" points="178.9,141.7 271.7,234.5 234.5,271.7 141.7,178.9 48.900000000000006,271.7 11.799999999999997,234.5 104.6,141.7 11.8,48.900000000000006 48.9,11.800000000000011 141.7,104.6 234.5,11.799999999999997 271.7,48.900000000000006 "></polygon>
            </svg>
            <div id="order_wrapper">
                <div id="add_order" className="theme_background">
                    <h2>Dauerauftrag erstellen</h2>
                    <input type="hidden"/>
                    <label className="export_label" id="name_label"><span className="label_name"></span>
                        <input type="text" autoComplete="off"/>
                    </label>
                    <label className="export_label" id="amount_label"><span className="label_name"></span>
                        <input type="text" autoComplete="off"/>
                    </label>
                    <label className="export_label" id="exec_date_label"><span className="label_name"></span>
                        <div id="exec_date"></div>
                    </label>
                    <label className="export_label" id="interval_select"><span className="label_name"></span></label>
                    <label className="export_label" id="exec_on_last"><span className="label_name"></span></label>
                    <button type="button" className="theme_background" id="create_order"></button>
                </div>
                <div id="manage_orders" className="theme_background">
                    <h2>Daueraufträge verwalten</h2>
                </div>
            </div>
        </div>
    );
}