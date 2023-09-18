import React from "react";
import './AccountMenu.scss';
import AddExpense from "./AddExpense";
import AccountSettings from "./AccountSettings";
export default function AccountMenu() {
    return (
        <aside>
            <AddExpense/>
            <AccountSettings/>
        </aside>
    );
}