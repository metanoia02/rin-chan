const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Give an item to another user.'),
    async execute(interaction) {
        
    },
};