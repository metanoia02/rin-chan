const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Check the leaderboard for a particular item.'),
        .addStringOption(option =>
            option.setName('item')
                .setDescription('The item for the leaderboard'));
    async execute(interaction) {
        
    },
};