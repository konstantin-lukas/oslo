import React, {useEffect, useState} from "react";
import AccountHeader from "./AccountHeader";
import BalanceChart from "./BalanceChart";
import './Account.scss';
import AccountTable from "./AccountTable";
import AccountMenu from "./AccountMenu";
import { sub } from 'date-fns'
export default function Account() {
    const [accountData, setAccountData] = useState<AccountData | null>();
    const [date, setDate] =
        useState<{from: Date, until: Date}>({
            from: sub(new Date(), {months: 1}),
            until: new Date()
        });

    useEffect(() => {
        setAccountData(api.getAccountById(1));
    }, []);

    if (accountData) {
        return (
            <main>
                <div className="wrapper">
                    <AccountHeader heading={accountData.name} date={date} setDate={setDate}/>
                    <BalanceChart/>
                    <div id="account">
                        <AccountTable transactions={accountData.transactions}/>
                        <AccountMenu/>
                    </div>
                </div>
            </main>
        );
    } else {
        // TODO: LOADING ANIMATION
        return (
            <main>
                <div className="wrapper">
                    <AccountHeader heading={""} date={date} setDate={setDate}/>
                    <BalanceChart/>
                    <div id="account">
                        <AccountTable transactions={[]}/>
                        <AccountMenu/>
                    </div>
                </div>
            </main>
        );
    }
}