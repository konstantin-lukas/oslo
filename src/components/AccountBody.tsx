import React from "react";
import AccountTable from "./AccountTable";
import AccountMenu from "./AccountMenu";
export default function AccountBody() {
    return (
        <div id="account">
            <AccountTable/>
            <AccountMenu/>
        </div>
    );
}