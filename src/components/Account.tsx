import React, {useEffect, useState} from "react";
import AccountHeader from "./AccountHeader";
import BalanceChart from "./BalanceChart";
import './Account.scss';
import AccountTable from "./AccountTable";
import AccountMenu from "./AccountMenu";
import { sub } from 'date-fns'
import TransactionFilter, {Filters} from "./TransactionFilter";
import {useDefer} from "anzol";
import {FilterContext} from "./misc/Contexts";

export default function Account({openAccount, openStandingOrders}: {
    openAccount: AccountData,
    openStandingOrders: () => void
}) {
    const [date, setDate] =
        useState<{from: Date, until: Date}>({
            from: sub(new Date(), {months: 1}),
            until: new Date()
        });

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [triggerFetchFlag, setTriggerFetchFlag] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        reference: "",
        category: ""
    });

    const deferredFilters = useDefer(filters, 300);

    useEffect(() => {
        api.db.getTransactions(
            openAccount?.id,
            date.from.toISOString().split('T')[0],
            date.until.toISOString().split('T')[0],
            deferredFilters
        ).then(trans => {
            setTransactions(trans);
        });
    }, [date, openAccount, triggerFetchFlag, deferredFilters]);

    return (
        <main>
            <div className="wrapper">
                <AccountHeader heading={openAccount?.name} date={date} setDate={setDate}/>
                <FilterContext.Provider value={deferredFilters}>
                    <BalanceChart
                        openAccountId={openAccount?.id}
                        transactions={transactions}
                        from={date.from}
                        until={date.until}
                    />
                    <TransactionFilter filters={filters} setFilters={setFilters}/>
                    <div id="account">
                        <AccountTable
                            transactions={transactions}
                            openAccount={openAccount}
                            fetchTransactions={() => setTriggerFetchFlag(!triggerFetchFlag)}
                        />
                        <AccountMenu
                            openAccount={openAccount}
                            openStandingOrders={openStandingOrders}
                            fetchTransactions={() => setTriggerFetchFlag(!triggerFetchFlag)}
                        />
                    </div>
                </FilterContext.Provider>
            </div>
        </main>
    );
}