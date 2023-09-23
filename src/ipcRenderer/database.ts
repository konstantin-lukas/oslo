import {ipcRenderer} from "electron";

const database = {
    getAccounts: async () => {
        return await ipcRenderer.invoke('getAccounts');
    },
    getBalance: async (id: number) => {
        return await ipcRenderer.invoke('getBalance', id);
    },
    getTransactions: async (id: number, from: string, until: string) => {
        return await ipcRenderer.invoke('getTransactions', id, from, until);
    },
    deleteTransaction: async (id: number) => {
        return await ipcRenderer.invoke('deleteTransaction', id);
    },
    postTransaction: async (title: string, sum: string, id: number) => {
        return await ipcRenderer.invoke('postTransaction', title, sum, id);
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
    getBalanceUntilExcluding: async (id: number, date: string) => {
        return await ipcRenderer.invoke('getBalanceUntilExcluding', id, date);
    },
    patchAccountColor: async (id: number, color: string) => {
        return await ipcRenderer.invoke('patchAccountColor', id, color);
    }
};

export default database;
