import React from "react";
import AccountHeader from "./AccountHeader";
import BalanceChart from "./BalanceChart";
import './Account.scss';
import AccountTable from "./AccountTable";
import AccountMenu from "./AccountMenu";
export default function Account() {
    return (
        <main>
            <div className="wrapper">
                <AccountHeader/>
                <BalanceChart/>
                <div id="account">
                    <AccountTable/>
                    <AccountMenu/>
                </div>
            </div>
        </main>
    );
}