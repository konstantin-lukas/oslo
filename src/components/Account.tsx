import React, {useEffect, useState} from "react";
import AccountHeader from "./AccountHeader";
import BalanceChart from "./BalanceChart";
import './Account.scss';
import AccountTable from "./AccountTable";
import AccountMenu from "./AccountMenu";
import { sub } from 'date-fns'
export default function Account({openAccount, fetchAccounts}: {
    openAccount: AccountData,
    fetchAccounts: () => void
}) {
    const [date, setDate] =
        useState<{from: Date, until: Date}>({
            from: sub(new Date(), {months: 1}),
            until: new Date()
        });

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [triggerFetchFlag, setTriggerFetchFlag] = useState(false);

    useEffect(() => {
        api.db.getTransactions(
            openAccount?.id,
            date.from.toISOString().split('T')[0],
            date.until.toISOString().split('T')[0]
        ).then(trans => {
            setTransactions(trans);
        });
    }, [date, openAccount, triggerFetchFlag]);

    return (
        <main>
            <div className="wrapper">
                <AccountHeader heading={openAccount?.name} date={date} setDate={setDate}/>
                <BalanceChart
                    openAccountId={openAccount?.id}
                    transactions={transactions}
                    from={date.from}
                    until={date.until}
                />
                <div id="account">
                    <AccountTable
                        transactions={transactions}
                        openAccount={openAccount}
                        fetchTransactions={() => setTriggerFetchFlag(!triggerFetchFlag)}
                    />
                    <AccountMenu
                        openAccount={openAccount}
                        fetchTransactions={() => setTriggerFetchFlag(!triggerFetchFlag)}
                        fetchAccounts={fetchAccounts}
                    />
                </div>
            </div>
        </main>
    );
}