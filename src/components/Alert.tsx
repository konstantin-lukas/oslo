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
        if (message && confirmAction)
            alertBox?.current?.classList.add("open_alert");
    }, [message, confirmAction]);
    return (
        <div id="custom_alert" ref={alertBox}>
            <span id="custom_message">{message}</span>
            <div id="custom_html"></div>
            <div id="buttons">
                <Button onClick={() => {
                    if (confirmAction)
                        confirmAction();
                    alertBox?.current?.classList.remove("open_alert");
                }}>{text?.confirm_}</Button>
                <Button onClick={() => {
                    alertBox?.current?.classList.remove("open_alert");
                }}>{text?.cancel_}</Button>
            </div>
        </div>
    );
}