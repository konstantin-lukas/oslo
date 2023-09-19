import React from "react";
import Header from "./components/Header";
import Account from "./components/Account";
import Alert from "./components/Alert";
import StandingOrders from "./components/StandingOrders";
import GlobalSettings from "./components/GlobalSettings";

export default function App() {
    const color: Color = {r: 0xff, g: 0x33, b: 0xa3};
    const contrast = (function () {
        const brightness = Math.round(((color.r * 299) + (color.g * 587) + (color.b * 114)) / 1000);
        return (brightness > 125) ? '#1a1a1a' : '#fff';
    })();
    const contrast_opposite = (contrast == '#fff') ? '#1a1a1a' : '#fff';
    const alt_opp = (contrast == '#1a1a1a') ? '#444' : '#fff';
    // TODO: REPLACE WITH CONTEXT
    const html =
        `::selection {
            color: ${contrast};
            background: rgba(${color.r},${color.g},${color.b},0.99);
        }
        .theme_fill {
            fill: rgb(${color.r},${color.g},${color.b}) !important;
        }
        .theme_background:not(#color_picker):not(button):not(#add_order):not(#manage_orders), input:checked + .toggle_checkbox, .pcr-save, .pcr-cancel {
            color: ${contrast} !important;
            background: rgb(${color.r},${color.g},${color.b}) !important;
        }
        .theme_background::after, .theme_background::before, button.del.theme_background:hover, .picker-content, .picker-foot, .custom-color-picker {
            background: ${contrast} !important;
        }
        ${(contrast == '#1a1a1a') ? '.picker-content, .picker-foot { background: #262626 !important }' : ''}
        input:not(:checked) .toggle_checkbox, input:checked + .toggle_checkbox::after {
            background: ${alt_opp} !important;
        }
        ${(alt_opp == '#444') ? '.light_mode input:checked + .toggle_checkbox::after { background: #e4e4e4 !important }' : ''}
        .toggle_checkbox::after, button.del.theme_background, .picker-head, .picker-active::before {
            background: rgb(${color.r},${color.g},${color.b}) !important;
        }
        button.theme_background:not(.del) {
            background: transparent !important;
            color: ${contrast} !important;
        }
        button.theme_background:not(.del):hover, .picker-content, .picker-foot {
            color: ${contrast_opposite} !important;
        }
        button.theme_background:not(.del)::after {
            background: linear-gradient(0deg, ${contrast}, ${contrast} 50%, rgb(${color.r},${color.g},${color.b}) 50%) !important;
        }
        #global_settings button.theme_background:not(.del)::after {
            background: linear-gradient(0deg, ${alt_opp}, ${alt_opp} 50%, rgb(${color.r},${color.g},${color.b}) 50%) !important;
        }
        button.del.theme_background:hover::before, button.del.theme_background:hover::after {
            background: ${contrast_opposite} !important;
        }
        .picker-now, .picker-row.picker-active {
            color: rgb(${color.r},${color.g},${color.b}) !important;
        }
        .picker-head *, .picker-active {
            color: ${contrast} !important;
        }`;
    return (
        <div>
            <style>
                {html}
            </style>
            <Header/>
            <Account/>
            <StandingOrders/>
            <GlobalSettings/>
            <Alert/>
        </div>
    )
}