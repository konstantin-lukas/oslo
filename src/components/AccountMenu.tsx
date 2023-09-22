import React from "react";
import './AccountMenu.scss';
import AddExpense from "./AddExpense";
import AccountSettings from "./AccountSettings";
export default function AccountMenu({openAccount, fetchTransactions, fetchAccounts}: {
    openAccount: AccountData,
    fetchTransactions: () => void;
    fetchAccounts: () => void;
}) {
    return (
        <aside>
            <AddExpense
                openAccount={openAccount}
                fetchTransactions={fetchTransactions}
            />
            <AccountSettings
                openAccount={openAccount}
                fetchTransactions={fetchTransactions}
                fetchAccounts={fetchAccounts}
            />
        </aside>
    );
}