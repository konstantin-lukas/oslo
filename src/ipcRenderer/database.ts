import {ipcRenderer} from "electron";
import {Filters} from "../components/TransactionFilter";

const database = {
    getAccounts: async () => {
        return await ipcRenderer.invoke('getAccounts');
    },
    getBalance: async (id: number, filters: Filters) => {
        return await ipcRenderer.invoke('getBalance', id, filters);
    },
    getTransactions: async (id: number, from: string, until: string, filters: {reference: string, category: string}) => {
        return await ipcRenderer.invoke('getTransactions', id, from, until, filters);
    },
    deleteTransaction: async (id: number) => {
        return await ipcRenderer.invoke('deleteTransaction', id);
    },
    postTransaction: async (title: string, sum: string, id: number, category: null | string) => {
        return await ipcRenderer.invoke('postTransaction', title, sum, id, category);
    },
    patchTransaction: async (title: string, sum: string, id: number, category: null | string) => {
        return await ipcRenderer.invoke('patchTransaction', title, sum, id, category);
    },
    deleteAccount: async (id: number) => {
        return await ipcRenderer.invoke('deleteAccount', id);
    },
    postAccount: async (
        name: string,
        currency: string,
        allow_overdrawing: boolean,
        theme_color: string,
        last_interest: number
    ) => {
        return await ipcRenderer.invoke(
            'postAccount',
            name,
            currency,
            allow_overdrawing,
            theme_color,
            last_interest
        );
    },
    getBalanceUntilExcluding: async (id: number, date: string, filters: Filters) => {
        return await ipcRenderer.invoke('getBalanceUntilExcluding', id, date, filters);
    },
    patchAccount: async (id: number, name: string, color: string, allow_overdrawing: boolean, interest_rate: number) => {
        return await ipcRenderer.invoke('patchAccount', id, name, color, allow_overdrawing, interest_rate);
    },
    postStandingOrder: async (account: number, title: string, category: string, sum: string, exec_interval: number, exec_on: number, last_exec: string) => {
        return await ipcRenderer.invoke('postStandingOrder', account, title, category, sum, exec_interval, exec_on, last_exec);
    },
    getStandingOrders: async (account: number) => {
        return await ipcRenderer.invoke('getStandingOrders', account);
    },
    deleteStandingOrder: async (id: number) => {
        return await ipcRenderer.invoke('deleteStandingOrder', id);
    },
    patchStandingOrder: async (id: number, title: string, category: string, sum: string, exec_interval: number, exec_on: number) => {
        return await ipcRenderer.invoke('patchStandingOrder', id, title, category, sum, exec_interval, exec_on);
    },
    executeStandingOrders: async () => {
        return await ipcRenderer.invoke('executeStandingOrders');
    }

};

export default database;
