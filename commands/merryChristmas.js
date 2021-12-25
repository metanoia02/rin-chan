const User = require('../utils/User');
const fs = require('fs');
const utils = require('../utils/utils');
const Discord = require('discord.js');

module.exports = {
    config: {
      training: [
        {locale: 'en', string: 'merry christmas'},
        {locale: 'en', string: 'happy christmas'},
      ],

      intent: 'merryChristmas',
      commandName: 'Merry Christmas',
      description: 'Its Christmaaaas',

      scope: 'channel',

      christmasImagesPath: './images/christmas/',
      itemImage: 'christmasItems.png',
    },

    init() {
        this.christmasImages = fs.readdirSync(this.config.christmasImagesPath).filter((file) => file.endsWith('.jpg'));
    },

    async run(message, args) {
        const user = new User(message);
        let messageStr = '';

        if (!user.isInSongbook('merryChristmasMyHero')) {
            messageStr = `I have a present for you, ${message.author}!`;

            let followupStr = `I added a song to your song book!
            I'll sing for you any time! And these golden oranges, 
            they will take those at the new shops in town. Let's go when they are open.`;

            if (user.getEntityQuantity('songBook') == 0)
            {
                followupStr = `Here's a songbook you can keep you're favourite songs in. I added a song just for you.
                I'll sing for you any time! And these golden oranges, 
                they will take those at the new shops in town. Let's go when they are open.`;

                user.changeEntityQuantity('songBook', 1);
            }

            setTimeout(() => {
                const attachment = new Discord.MessageAttachment(
                    this.config.christmasImagesPath + this.config.itemImage,
                    this.config.itemImage);

                const embed = new Discord.MessageEmbed()
                  .setColor('#FF0000')
                  .setTitle('Merry Christmas!')
                  .setDescription(followupStr)
                  .attachFiles(attachment)
                  .setImage(`attachment://${this.config.itemImage}`)
                  .setFooter(`${user.getDiscordMember().displayName}`, user.getDiscordUser().avatarURL());

                message.author.send(embed);

                user.changeEntityQuantity('goldenOrange', 5);
                user.addSong('merryChristmasMyHero');
            }, 10000);
        } else {
            messageStr = `Didn't I already give you a present? Hope you're having a good day!`;
        }

        const attachment = new Discord.MessageAttachment(
            `${this.config.christmasImagesPath}${utils.arrayRandom(this.christmasImages)}`,
            'christmas.jpg');

        const embed = new Discord.MessageEmbed()
          .setColor('#FF0000')
          .setTitle('Merry Christmas!')
          .setDescription(messageStr)
          .attachFiles(attachment)
          .setImage(`attachment://christmas.jpg`)
          .setFooter(`${user.getDiscordMember().displayName}`, user.getDiscordUser().avatarURL());

        message.channel.send(embed);
    },
}; 