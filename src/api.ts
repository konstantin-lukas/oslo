import {ipcRenderer} from "electron";

export default {
    send: (channel: string) => {
        ipcRenderer.send(channel);
    },
    on: (channel: string, fn: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on(channel, fn);
    },
    getAccountById: (id: number): AccountData => {
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
    }
}