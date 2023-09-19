import React from "react";
import './AccountHeader.scss';
export default function AccountHeader({heading}: {heading: string}) {
    return (
        <div id="main_header">
            <h1>{heading}</h1>
            <div id="time_span">
                <span id="from_date" data-date="2021-04-01">2021/04/01</span><span id="until_date" data-date="2021-04-14">2021/04/14</span>
            </div>
        </div>
    );
}