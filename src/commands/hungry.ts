const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hungry')
        .setDescription('See if Rin-chan is hungry.'),
    async execute(interaction) {
        
    },
};