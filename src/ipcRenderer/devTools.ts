import {ipcRenderer} from "electron";

const devTools = {
    contextMenu: (pos: {x: number, y: number}) => ipcRenderer.send('context_menu', pos)
};

export default devTools;