import React from "react";
import './AddExpense.scss';
export default function AddExpense() {
    return (
        <div id="addExpense">
            <h2>Transaktion</h2>
            <label><span id="amount">Betrag</span>
                <input type="text" className="amount" name="amount" autoComplete="off"/>
            </label>
            <label><span id="title">Verwendungszweck</span>
                <input type="text" className="title" name="title" autoComplete="off"/>
            </label>
            <input type="hidden" value="0"/>
            <button id="confirm" type="button" className="theme_background">Bestätigen</button>
        </div>
    );
}