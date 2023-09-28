import React from "react";
import './AccountMenu.scss';
import AddExpense from "./AddExpense";
import AccountSettings from "./AccountSettings";
export default function AccountMenu({openAccount, fetchTransactions, openStandingOrders}: {
    openAccount: AccountData,
    fetchTransactions: () => void,
    openStandingOrders: () => void
}) {
    return (
        <aside>
            <AddExpense
                openAccount={openAccount}
                fetchTransactions={fetchTransactions}
            />
            <AccountSettings
                openAccount={openAccount}
                openStandingOrders={openStandingOrders}
                fetchTransactions={fetchTransactions}
            />
        </aside>
    );
}