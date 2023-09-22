import {ipcRenderer} from "electron";

export async function getAccounts() {
    return await ipcRenderer.invoke('getAccounts');
}

export async function getBalance(id: number) {
    return await ipcRenderer.invoke('getBalance', id);
}

export async function getTransactions(id: number, from: string, until: string) {
    return await ipcRenderer.invoke('getTransactions', id, from, until);
}

export async function deleteTransaction(id: number) {
    return await ipcRenderer.invoke('deleteTransaction', id);
}
export async function postTransaction(title: string, sum: string, id: number) {
    return await ipcRenderer.invoke('postTransaction', title, sum, id);
}
export async function deleteAccount(id: number) {
    return await ipcRenderer.invoke('deleteAccount', id);
}
export async function postAccount(
    name: string,
    currency: string,
    allow_overdrawing: boolean,
    theme_color: string,
    last_interest: number
) {
    return await ipcRenderer.invoke(
        'postAccount',
        name,
        currency,
        allow_overdrawing,
        theme_color,
        last_interest
    );
}