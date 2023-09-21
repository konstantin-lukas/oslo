import React, {useEffect, useState} from "react";
import Header from "./components/Header";
import Account from "./components/Account";
import Alert from "./components/Alert";
import StandingOrders from "./components/StandingOrders";
import GlobalSettings from "./components/GlobalSettings";
import {TextContext} from "./components/misc/Contexts";
import availableLanguages from './lang.json';
import {ThemeProvider} from "styled-components";


export default function App() {
    const [textContent, setTextContent] = useState(null);
    const [themeColor, setThemeColor] = useState({
        theme_color: {
            r: 0xff,
            g: 0x33,
            b: 0xa3
        },
        neutral_color: '#1a1a1a',
        neutral_opposite: '#ffffff',
        other_opposite: '#444444'
    });

    useEffect(() => {
        api.getTextContent(availableLanguages[3].code).then(result => {
            setTextContent(result);
        });
        const color = {r: 0xff, g: 0x33, b: 0xa3};
        const contrast = (function () {
            const brightness = Math.round(((color.r * 299) + (color.g * 587) + (color.b * 114)) / 1000);
            return (brightness > 125) ? '#1a1a1a' : '#fff';
        })();
        const contrast_opposite = (contrast == '#fff') ? '#1a1a1a' : '#fff';
        const alt_opp = (contrast == '#1a1a1a') ? '#444' : '#fff';
        setThemeColor({
            theme_color: color,
            neutral_color: contrast,
            neutral_opposite: contrast_opposite,
            other_opposite: alt_opp
        });
    }, []);

/*    const StyledDiv = styled.div`
      & *::selection {
        color: ${colors.neutral_color};
        background: rgba(${colors.theme_color.r},${colors.theme_color.g},${colors.theme_color.b},0.99);
      }
    `;*/


    // TODO: REPLACE WITH CONTEXT
        /*
        .theme_fill {
            fill: rgb(${colors.theme_color.r},${colors.theme_color.g},${colors.theme_color.b}) !important;
        }
        .theme_background:not(#color_picker):not(button):not(#add_order):not(#manage_orders), input:checked + .toggle_checkbox, .pcr-save, .pcr-cancel {
            color: ${colors.neutral_color} !important;
            background: rgb(${colors.theme_color.r},${colors.theme_color.g},${colors.theme_color.b}) !important;
        }
        .theme_background::after, .theme_background::before, button.del.theme_background:hover, .picker-content, .picker-foot, .custom-color-picker {
            background: ${colors.neutral_color} !important;
        }
        ${(colors.neutral_color == '#1a1a1a') ? '.picker-content, .picker-foot { background: #262626 !important }' : ''}
        input:not(:checked) .toggle_checkbox, input:checked + .toggle_checkbox::after {
            background: ${colors.other_opposite} !important;
        }
        ${(colors.other_opposite == '#444') ? '.light_mode input:checked + .toggle_checkbox::after { background: #e4e4e4 !important }' : ''}
        .toggle_checkbox::after, button.del.theme_background, .picker-head, .picker-active::before {
            background: rgb(${colors.theme_color.r},${colors.theme_color.g},${colors.theme_color.b}) !important;
        }
        #global_settings button.theme_background:not(.del)::after {
            background: linear-gradient(0deg, ${colors.other_opposite}, ${colors.other_opposite} 50%, rgb(${colors.theme_color.r},${colors.theme_color.g},${colors.theme_color.b}) 50%) !important;
        }*/
    return (
        <div>
            <TextContext.Provider value={textContent}>
                <ThemeProvider theme={themeColor}>
                    <Header/>
                    <Account/>
                    <StandingOrders/>
                    <GlobalSettings/>
                    <Alert/>
                </ThemeProvider>
            </TextContext.Provider>
        </div>
    )
}