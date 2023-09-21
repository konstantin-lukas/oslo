import {ipcMain} from "electron";
import {promises as fs} from "fs";

export default function registerLanguage() {
    ipcMain.handle('language', async (_, lang): Promise<TextContent | null> => {
        let json: TextContent | null;
        try {
            const rawData = await fs.readFile('/home/konstantin/github/spectrum-savings-accounts/src/lang/'+lang+'.json', 'utf-8');
            json = JSON.parse(rawData);
        } catch (e) {
            json = null;
        }
        return json;
    });
}