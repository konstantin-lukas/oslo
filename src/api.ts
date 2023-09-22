import textContent from "./ipcRenderer/textContent";
import {maximizeApp, maximizeCallback, minimizeApp, unmaximizeCallback, closeApp} from "./ipcRenderer/window";
import {
    deleteAccount,
    deleteTransaction,
    getAccounts,
    getBalance,
    getTransactions,
    postAccount,
    postTransaction
} from "./ipcRenderer/database";

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
    postTransaction,
    deleteAccount,
    postAccount
}