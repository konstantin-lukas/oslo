import React, {useContext, useEffect, useRef, useState} from "react";
import './Alert.scss';
import Button from "./Button";
import {LightModeContext, TextContext} from "./misc/Contexts";
import {useTheme} from "styled-components";
export default function Alert({message, confirmAction, cancelAction} : {
    message: string,
    confirmAction: () => void,
    cancelAction?: () => void
}) {
    const text = useContext(TextContext);
    const lightMode = useContext(LightModeContext);
    const theme = useTheme();
    const alertBox = useRef(null);
    const [initialRender, setInitialRender] = useState(true);
    useEffect(() => {
        if (!initialRender) {
            if (message && confirmAction) {
                alertBox?.current?.classList.add("open_alert");
                alertBox?.current?.classList.add("visible_alert");
            }
        } else {
            setInitialRender(false);
        }

    }, [message, confirmAction]);
    return (
        <div id="custom_alert_bg" ref={alertBox} onClick={(e) => {
            if (e.target === alertBox?.current) {
                alertBox?.current?.classList.remove("open_alert");
                setTimeout(() => {
                    alertBox?.current?.classList.remove("visible_alert");
                }, 200);
            }
        }}>
            <div id="custom_alert">
                <span id="custom_message">{message}</span>
                <div id="custom_html"></div>
                <div id="buttons">
                    <Button
                        altColors={lightMode && theme.neutral_color === '#ffffff'}
                        style={!cancelAction ? {
                            marginRight: '0'
                        } : null}
                        onClick={() => {
                        if (confirmAction)
                            confirmAction();
                        alertBox?.current?.classList.remove("open_alert");
                        setTimeout(() => {
                            alertBox?.current?.classList.remove("visible_alert");
                        }, 200);
                    }}>{text?.confirm_}</Button>
                    {
                        cancelAction ?
                            <Button
                                altColors={lightMode && theme.neutral_color === '#ffffff'}
                                onClick={() => {
                                cancelAction();
                                alertBox?.current?.classList.remove("open_alert");
                                setTimeout(() => {
                                    alertBox?.current?.classList.remove("visible_alert");
                                }, 200);
                            }}>{text?.cancel_}</Button> : <></>
                    }
                </div>
            </div>
        </div>
    );
}