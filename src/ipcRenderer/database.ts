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