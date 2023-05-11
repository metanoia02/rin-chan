const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('currency')
        .setDescription('Currency conversion.'),
    async execute(interaction) {
        
    },
};