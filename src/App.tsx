import React from "react";
import Header from "./components/Header";
import Account from "./components/Account";
import Alert from "./components/Alert";
import StandingOrders from "./components/StandingOrders";
import GlobalSettings from "./components/GlobalSettings";

export default function App() {
    return (
        <div>
            <Header/>
            <Account/>
            <StandingOrders/>
            <GlobalSettings/>
            <Alert/>
        </div>
    )
}