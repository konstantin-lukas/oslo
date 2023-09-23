import React, {useContext, useEffect, useRef} from "react";
import './Alert.scss';
import Button from "./Button";
import {TextContext} from "./misc/Contexts";
export default function Alert({message, confirmAction} : {
    message: string,
    confirmAction: () => void
}) {
    const text = useContext(TextContext);
    const alertBox = useRef(null);
    useEffect(() => {
        if (message && confirmAction) {
            alertBox?.current?.classList.add("open_alert");
            alertBox?.current?.classList.add("visible_alert");
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
                    <Button onClick={() => {
                        if (confirmAction)
                            confirmAction();
                        alertBox?.current?.classList.remove("open_alert");
                        setTimeout(() => {
                            alertBox?.current?.classList.remove("visible_alert");
                        }, 200);
                    }}>{text?.confirm_}</Button>
                    <Button onClick={() => {
                        alertBox?.current?.classList.remove("open_alert");
                        setTimeout(() => {
                            alertBox?.current?.classList.remove("visible_alert");
                        }, 200);
                    }}>{text?.cancel_}</Button>
                </div>
            </div>
        </div>
    );
}