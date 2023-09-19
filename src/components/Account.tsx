import React, {useEffect, useState} from "react";
import AccountHeader from "./AccountHeader";
import BalanceChart from "./BalanceChart";
import './Account.scss';
import AccountTable from "./AccountTable";
import AccountMenu from "./AccountMenu";
export default function Account() {
    const [accountData, setAccountData] = useState<AccountData | null>();

    useEffect(() => {
        setAccountData(api.getAccountById(1));
    }, []);

    if (accountData) {
        return (
            <main>
                <div className="wrapper">
                    <AccountHeader heading={accountData.name}/>
                    <BalanceChart/>
                    <div id="account">
                        <AccountTable transactions={accountData.transactions}/>
                        <AccountMenu/>
                    </div>
                </div>
            </main>
        );
    } else {
        return (
            <main>
                <div className="wrapper">
                    <AccountHeader heading={""}/>
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