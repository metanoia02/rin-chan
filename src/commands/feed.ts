const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feed')
        .setDescription('Feed Rin-chan some foods.'),
    async execute(interaction) {
        
    },
};