const fs = require('node:fs');
const path = require('node:path');
import { CommandList } from "../commands/Commands";

export default (): void => {
    const foldersPath = path.join(__dirname, '../commands');
    const commandFolders = fs.readdirSync(foldersPath, { withFileTypes: true });

    for (const folder of commandFolders) {
        if(folder.isDirectory()) {
            const commandsPath = path.join(foldersPath, folder.name);
            const commandFiles = fs.readdirSync(commandsPath).filter((file:any) => file.endsWith('.ts'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const name = file.split(".")[0];
                const command = require(filePath)[name];

                if ('data' in command && 'execute' in command) {
                    CommandList.set(command.data.name, command);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }
    }
}

