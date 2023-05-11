const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('harvest')
        .setDescription('Try to harvest some oranges'),
    async execute(interaction) {
        
    },
};