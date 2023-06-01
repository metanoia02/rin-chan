import { Client, Events, Interaction } from "discord.js";
import { CommandList } from "../commands/Commands";

export default (client: Client): void => {
    client.on(Events.InteractionCreate, async (interaction:Interaction) => {
        if (!interaction.isChatInputCommand()) return;
    
        const command = CommandList.get(interaction.commandName);
    
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
    
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    });
}