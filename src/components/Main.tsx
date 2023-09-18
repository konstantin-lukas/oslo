import React from "react";
import AccountHeader from "./AccountHeader";
import BalanceChart from "./BalanceChart";
import AccountBody from "./AccountBody";
import Alert from "./Alert";
export default function Main() {
    return (
        <main>
            <div className="wrapper">
                <AccountHeader/>
                <BalanceChart/>
                <AccountBody/>
                <Alert/>
            </div>
        </main>
    );
}