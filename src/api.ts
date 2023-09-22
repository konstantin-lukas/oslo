import textContent from "./ipcRenderer/textContent";
import {maximizeApp, maximizeCallback, minimizeApp, unmaximizeCallback, closeApp} from "./ipcRenderer/window";
import {deleteTransaction, getAccounts, getBalance, getTransactions} from "./ipcRenderer/database";

export default {
    getAccounts,
    minimizeApp,
    maximizeApp,
    closeApp,
    maximizeCallback,
    unmaximizeCallback,
    textContent,
    getBalance,
    getTransactions,
    deleteTransaction,
    getAccountById: (id: number) => {
        return (
            {
                "id": 1,
                "name": "New Account",
                "currency": "EUR",
                "allow_negative_values": false,
                "interest_rate": 0,
                "creation_date": "2021-07-10",
                "last_interest": 2020,
                "theme_color": {
                    "r": 255,
                    "g": 255,
                    "b": 255
                },
                "transactions": [
                    {
                        "id": 1,
                        "title": "Obi",
                        "sum": "-41.00",
                        "date": "2023-09-19",
                        "time": "18:29:9"
                    }, {
                        "id": 2,
                        "title": "Blumenkästen",
                        "sum": "-21.37",
                        "date": "2023-09-19",
                        "time": "13:56:42"
                    }
                ],
                "standing_orders": [
                    {
                        "title": "Spotify Premium Student",
                        "sum": "-4,99",
                        "exec_interval": 1,
                        "exec_on": 1,
                        "last_exec": "2023-09-01"
                    }
                ]
            }
        );
    },
}