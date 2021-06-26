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
      {locale: 'en', string: 'give %user% %number% %entity%'},
      {locale: 'en', string: 'give %user% an %entity%'},
      {locale: 'en', string: 'give %user% a %entity%'},
      {locale: 'en', string: 'give a %entity% to %user%'},

      {locale: 'en', string: 'give %tag% %number% %entity%'},
      {locale: 'en', string: 'give %tag% an %entity%'},
      {locale: 'en', string: 'give %tag% a %entity%'},
      {locale: 'en', string: 'give a %entity% to %tag%'},

      {locale: 'en', string: 'give %everyone% %number% %entity%'},
    ],

    intent: 'giveEntity',
    commandName: 'Give',
    description: 'Give something you have to another user.',

    scope: 'channel',
  },

  init() {
    this.orangeReaction = new Reaction('../reactions/feed/orange.json', this.config.commandName);
  },

  async run(message, args) {
    if (args.tradable.length === 0) {
      if (args.entities.length > 0) {
        throw new CommandException(`You can't trade that.`, `rinwha.png`);
      } else {
        throw new CommandException(`You didn't tell me what`, `rinwha.png`);
      }
    } else if (args.tradable.length !== 1) {
      throw new CommandException(`Which one?`, `rinconfuse.png`);
    }

    if (args.everyone) {
      if (message.member.roles.cache.some((role) => role.name === 'Mods')) {
        this.giveEveryone(message, args);
      } else {
        throw new CommandException('Nice try.', 'smugrin.png');
      }
    } else {
      this.giveObject(message, args);
    }
  },

  giveEveryone(message, args) {
    const entity = args.tradable[0];
    const num = args.quantities[0] ? parseInt(args.quantities[0]) : 1;

    const entityString = num > 1 ? entity.plural : entity.determiner + ' ' + entity.name;
    const entityNumString = num > 1 ? num + ' ' + entityString : entityString;

    const users = database.getAllUsers.all();
    users.forEach((user) => {
      const thisUser = new User(undefined, user.user, user.guild);
      thisUser.changeEntityQuantity(entity.id, num);
    });

    message.channel.send('Ok, you gave everyone ' + entityNumString);
  },

  giveObject(message, args) {
    const sourceUser = new User(message);
    const destUser = args.mentions[0] || args.tags[0];
    const entity = args.tradable[0];
    const num = args.quantities[0] ? parseInt(args.quantities[0]) : 1;

    const entityString = num > 1 ? entity.plural : entity.determiner + ' ' + entity.name;
    const entityNumString = num > 1 ? num + ' ' + entityString : entityString;

    if (sourceUser.getEntityQuantity(entity.id) >= num) {
      if (num < 1) {
        throw new CommandException(`Fine, no ${entityString} for them`, 'rinsmug.png');
      } else if (destUser.getId() == message.author.id) {
        throw new CommandException(`You cant give ${entityString} to yourself!`, 'rinconfuse.png');
      } else if (destUser.getId() == config.gumiId) {
        if (entity.id == 'carrot') {
          this.giveGumiCarrot(message, num, sourceUser);
        } else if (entity.id == 'carrotBirthdayCake') {
          this.giveGumiCake(message, num, sourceUser);
        } else if (entity.id == 'orange') {
          this.giveGumiOrange(message, num, sourceUser);
        }
      } else if (
        message.client.users.cache.get(destUser.getDiscordUser().bot && message.client.user.id != destUser.getId())
      ) {
        throw new CommandException(`Why would that bot need ${entityString}...`, 'rinwha.png');
      } else {
        if (destUser.getId() == message.client.user.id) {
          if (entity.id === 'orange') {
            message.channel.send(`Thanks, I'll put them to good use`);
            sourceUser.changeEntityQuantity(entity.id, -num);
            destUser.changeEntityQuantity(entity.id, num);
          } else {
            message.channel.send('You keep that for now <:rinlove:726120311967449199>');
          }
        } else {
          if (entity.id == 'christmasPresent') {
            this.giveChristmasPresent(sourceUser, destUser, message);
          } else {
            message.channel.send('Ok, you gave ' + entityNumString);
            sourceUser.changeEntityQuantity(entity.id, -num);
            destUser.changeEntityQuantity(entity.id, num);
          }
        }
      }
    } else {
      message.channel.send(`You don't have ` + entityNumString + ' to give');
    }
  },

  async giveChristmasPresent(sourceUser, destUser, message) {
    await message.channel.send(`Hey ${destUser.getDiscordUser()} theres a present for you! It's from ${sourceUser.getDiscordUser()}\nDo you want to open it?`);

    const openRegex = /yes|open|ok/gi;

    const filter = (response) => {
      return response.author.id === destUser.getId() && response.content.match(openRegex);
    };

    rinChan.setCollecting(true);

    message.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ['time']})
      .then((collected) => {
        setTimeout(() => {
          message.channel.send('*rustle rustle*...');
        }, 4000);

        setTimeout(() => {
          const embed = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Merry Christmas!')
            .setDescription('Inside you find a bunch of oranges! Some of them are golden.')
            .setFooter(`${destUser.getDiscordMember().displayName}`, destUser.getDiscordUser().avatarURL());

          message.channel.send(embed);

          destUser.changeEntityQuantity('orange', 20);
          destUser.changeEntityQuantity('goldenOrange', 2);
          sourceUser.changeEntityQuantity('christmasPresent', -1);
          console.log(`${sourceUser.getDiscordUser().username} gave a present`);

          rinChan.setCollecting(false);
        }, 10000);
      })
      .catch((collected) => {
        rinChan.setCollecting(false);

        if (collected instanceof CommandException || collected instanceof Error) {
          utils.handleError(collected, this.config.commandName, message.channel);
        } else {
          message.channel.send(`Don't worry! Maybe they'll be here to open it later`);
        }
      });
  },

  async giveGumiOrange(message, quantity, sourceUser) {
    let orangeString = quantity > 1 ? quantity+' oranges' : 'an orange';

		const filter = (response) => {
			return response.author.id === config.gumiId;
		};

		let currentTime = new Date();

		if (quantity > sourceUser.getEntityQuantity('orange')) {
			throw new CommandException('You dont have that many oranges', 'rinyabai.png');
		}

		message.channel.send(`Hey ${message.guild.member(config.gumiId)}, ${message.author} sent `+ orangeString).then(() => {
			message.channel
				.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
				.then((collected) => {
					message.channel.startTyping();
					setTimeout(function () {
						message.channel.send('Thanks!!!');
						message.channel.stopTyping(true);

						if (rinChan.getHunger() > 3) {
              const gumiUser = new User(message, config.gumiId, message.guild.id);
              message.channel.send(module.exports.orangeReaction.getEmbed(gumiUser));

              quantity--;
              sourceUser.changeAffection(5);
              sourceUser.changeEntityQuantity('orange', -1);
              sourceUser.setLastGive();
              rinChan.setHunger(rinChan.getHunger() - 1);
              rinChan.setLastFed(currentTime.getTime());
						}

            const rinChanUser = new User(message, rinChan.getId(), message.guild.id);

						rinChanUser.changeEntityQuantity('orange', quantity);
            sourceUser.changeEntityQuantity('orange', -quantity);
					}, 3000);
				})
				.catch((collected) => {
					console.log(collected);
				});
		});
	},

	async giveGumiCarrot(message, quantity, sourceUser) {
		let carrotString = quantity > 1 ? quantity + ' carrots' : 'a carrot';

		const filter = (response) => {
			return response.author.id === config.gumiId;
		};

		if (quantity > sourceUser.getEntityQuantity('carrot')) {
			throw new CommandException('You dont have that many carrots', 'rinyabai.png');
		}

		message.channel.send(`Hey ${message.guild.member(config.gumiId)}, ${message.author} sent `+ carrotString).then(() => {
			message.channel
				.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
				.then((collected) => {
					message.channel.startTyping();
					setTimeout(function () {
						message.channel.send('You really like those weird things huh...');
						message.channel.stopTyping(true);
					}, 3000);
				})
				.catch((collected) => {
					console.log(collected);
				});
		});

    sourceUser.changeEntityQuantity('carrot', -quantity);
	},

	async giveGumiCake(message, quantity, sourceUser) {
		const filter = (response) => {
			return response.author.id === config.gumiId;
		};

		try {
			if (sourceUser.getEntityQuantity('carrotBirthdayCake') < 1) {
        throw new CommandException("You don't have a cake", 'rinconfuse.png');
      }

			sourceUser.changeEntityQuantity('carrotBirthdayCake', -1);

			message.channel.send(`Happy Birthday ${message.guild.member(config.gumiId)}, we baked you a cake!!!`).then(() => {
				message.channel
					.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
					.then((collected) => {
						message.channel.startTyping();
						setTimeout(function () {
							message.channel.send("Looks tasty, gimme a slice... without the carrots.");
							message.channel.stopTyping(false);

							setTimeout(function () {
								if (!sourceUser.isInSongbook('12FanclubSingle')) {
									const attachment = new Discord.MessageAttachment('./images/entity/12FanclubSingle.png', '12FanclubSingle.png');
									const fanclubEmbed = new Discord.MessageEmbed()
										.setColor('#00FF00')
										.setTitle('GUMI Birthday Event')
										.setDescription(`Thanks for helping me ${message.member.displayName}, you can have this`)
										.setFooter('You recieved the 1, 2 Fanclub Single')
										.attachFiles(attachment)
										.setThumbnail('attachment://12FanclubSingle.png');
									message.channel.send(fanclubEmbed).catch(console.error);
									message.channel.stopTyping(true);

                  sourceUser.addSong('12FanclubSingle');

                  if (sourceUser.getEntityQuantity('songBook') < 1) {
                    sourceUser.changeEntityQuantity('songBook', 1);
                  }
								} else {
                  const attachment = new Discord.MessageAttachment('./images/entity/goldenOrange.png', 'goldenOrange.png');
									const fanclubEmbed = new Discord.MessageEmbed()
										.setColor('#00FF00')
										.setTitle('GUMI Birthday Event')
										.setDescription(`Thanks for helping me ${message.member.displayName}, you can have these`)
										.setFooter('You recieved the 5 Golden oranges!')
										.attachFiles(attachment)
										.setThumbnail('attachment://goldenOrange.png');
									message.channel.send(fanclubEmbed).catch(console.error);
									message.channel.stopTyping(true);
                }
							}, 3000);
						}, 3000);
					})

					.catch((collected) => {
						console.log(collected);
					});
					message.channel.stopTyping(true);
			});
			message.channel.stopTyping(true);

		} catch (err) {
			if (err instanceof CommandException) {
				message.channel.send(err.getEmbed('Give Object')).catch(console.error);
			} else {
				console.log(err);
			}
		}
	},
};
