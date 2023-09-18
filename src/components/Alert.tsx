import React from "react";
import './Alert.scss';
export default function Alert() {
    return (
        <div id="custom_alert">
            <span id="custom_message"></span>
            <div id="custom_html"></div>
            <div id="buttons">
                <button type="button" name="confirm" className="light_mode theme_background"></button>
                <button type="button" name="cancel" className="light_mode theme_background"></button>
            </div>
        </div>
    );
}