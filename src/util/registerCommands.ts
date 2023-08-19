/**
 * Command registration function from Discord.js documentation.
 * https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration
 */

import { REST } from 'discord.js';
import { Routes } from 'discord-api-types/v10';
import { clientId, guildId, token } from '../tokens.json';
import { CommandList } from '../commands/Commands';

const commands = CommandList.map((command) => command.data.toJSON());

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    commands.forEach((command) => console.log(command.name));

    // The put method is used to fully refresh all commands in the guild with the current set
    const data: any = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
