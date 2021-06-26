/* eslint-disable no-tabs */
const User = require('../utils/User.js');
const CommandException = require('../utils/CommandException.js');
const database = require('../utils/sql.js');
const rinChan = require('../rinChan/rinChan');
const Discord = require('discord.js');
const config = require('../config.js');
const Reaction = require('../reactions/reaction.js');

module.exports = {
    config: {
      training: [
        {locale: 'en', string: 'bake cake'},
        {locale: 'en', string: 'bake a cake'},
        {locale: 'en', string: 'bake a birthday cake'},
        {locale: 'en', string: 'bake gumis cake'},
      ],
  
      intent: 'bakeCake',
      commandName: 'Bake a cake',
      description: 'Bake a cake for GUMI.',
  
      scope: 'channel',
    },

    async run(message, args) {
        //check for cake mix, lens, carrots
        const sourceUser = new User(message);
    
        if (sourceUser.getEntityQuantity('cakeMix') < 1) {
            message.channel.send('I need a cake mix');
        } else if (sourceUser.getEntityQuantity('kagamineLen') < 1) {
            message.channel.send('I could really use help from Len <:rinconfuse:726124190377312337>');
        } else if (sourceUser.getEntityQuantity('carrot') < 2) {
            message.channel.send('A cake for GUMI needs carrots, two should do!');
        } else {
            const chance = Math.floor(Math.random() * 100) + 1;
    
            if (chance > 40) {
                sourceUser.changeEntityQuantity('carrotBirthdayCake', 1);
    
                const attachment = new Discord.MessageAttachment('./images/gumi/cake.jpg', 'cake.jpg');
                const bakedCakeEmbed = new Discord.MessageEmbed()
                    .setColor('#00FF00')
                    .setTitle('Bake A Cake')
                    .setDescription("We did it! You got a Birthday Carrot Cake")
                    .attachFiles(attachment)
                    .setImage('attachment://cake.jpg');
        
                message.channel.send(bakedCakeEmbed).catch(console.error);
            } else {
                const attachment = new Discord.MessageAttachment('./images/gumi/burnt.png', 'burnt.png');
                const bakedCakeEmbed = new Discord.MessageEmbed()
                    .setColor('#000000')
                    .setTitle('Bake A Cake')
                    .setDescription("I'm sorry... we burnt it <:rinbuaaa:858417483521720370>")
                    .attachFiles(attachment)
                    .setImage('attachment://burnt.png');
        
                message.channel.send(bakedCakeEmbed).catch(console.error);
            }

            sourceUser.changeEntityQuantity('cakeMix', -1);
            sourceUser.changeEntityQuantity('kagamineLen', -1);
            sourceUser.changeEntityQuantity('carrot', -5);
        }
    },
  };
  

