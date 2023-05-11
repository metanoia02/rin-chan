const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('headpat')
        .setDescription('Give Rin-chan headpats.'),
    async execute(interaction) {
        
    },
};