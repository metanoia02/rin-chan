const rinChan = require('../rinChan/rinChan');
const Discord = require('discord.js');
const entityManager = require('../utils/entityManager');
const database = require('../utils/sql');
const CommandException = require('../utils/CommandException');

module.exports = class Quest {
  /**
   * 
   * @param {*} user 
   * @param {*} script 
   */
    constructor(user, quest) {
      this.quest = quest;
      this.script = require('./scripts/' + quest.filename);
      this.title = this.script.config.title;
      this.user = user;

      this.digits = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
  }

  /**
   * 
   */
  async execute(message) {
    if (this.script.config.scope == 'DM') {
      this.channel = await message.author.createDM();
    } else {
      this.channel = message.channel;
    }

    let currentMsg = {};
    let nextMsg = {};
    this.questLog = database.getQuestLog(this.user, this.quest);

    if (this.questLog.status == 'completed') {
      throw new CommandException(`You've already completed this quest`, 'rinchill.png');
    } else if (this.questLog.status == 'saved') {
      nextMsg = this.goto(this.questLog.saveLabel);
    } else {
      nextMsg = this.script.convo[0];
    }

    do {
      currentMsg = nextMsg;

      this.channel.startTyping();
      await this.wait(2000);
      this.channel.stopTyping();

      if (currentMsg.qs) {
        const nextIndex = await this.askQuestion(currentMsg);
        if (!nextIndex) {
          return;
        }
        nextMsg = this.goto(nextIndex);

        this.questLog.status = 'saved';
        this.questLog.saveLabel = nextMsg.lbl;
        database.updateQuest.run(this.questLog);
      } else if (currentMsg.msg) {
        await this.displayMessage(currentMsg);

        if (!currentMsg.nxt) {
          nextMsg = this.script.convo[this.script.convo.indexOf(currentMsg) + 1];
        } else {
          nextMsg = this.goto(currentMsg.nxt);
        }
      }


      if (currentMsg.reward) {
        for await (const [index, reward] of currentMsg.reward.entries()) {
          const rewardEntity = entityManager.get(reward.entityId || reward.songId);
          let entityString = '';

          if (reward.songId) {
            this.user.addSong(reward.songId);

            entityString = rewardEntity.name;
          } else {
            this.user.changeEntityQuantity(reward.entityId, reward.quantity);

            entityString = `${reward.quantity} ${reward.quantity > 1 ? rewardEntity.plural : rewardEntity.name}`;
          }

          const entityFn = rewardEntity.id + '.png';
          const thumbnail = new Discord.MessageAttachment('./images/entity/' + entityFn, entityFn);

          const embed = new Discord.MessageEmbed()
          .setColor('#FFA500')
          .setTitle(this.title)
          .setDescription(`You got ${entityString}`)
          .attachFiles(thumbnail)
          .setThumbnail(`attachment://${entityFn}`);

          if (this.user.hasDiscordMember() &&
          this.script.config.scope == 'channel') {
            embed.setFooter(`${this.user.getDiscordMember().displayName}`, this.user.getDiscordUser().avatarURL());
          }

          await this.channel.send(embed);
        }
      }

      if (currentMsg.save) {
        this.questLog.status = 'saved';
        this.questLog.saveLabel = currentMsg.save;
        database.updateQuest.run(this.questLog);

        return;
      }
     } while(!currentMsg.end);

     this.questLog.status = 'completed';
     this.questLog.saveLabel = null;
     database.updateQuest.run(this.questLog);
  }

  /**
   * 
   * @param {*} label 
   */
  goto(label) {
    const gotoLine = this.script.convo.find((line) => line.lbl == label);
    if(!gotoLine) {
      throw new Error('Script error: goto invalid line label');
    }

    return gotoLine;
  }

  /**
   * 
   */
  async displayMessage(msgLine) {
    const embed = new Discord.MessageEmbed()
    .setColor('#FFA500')
    .setTitle(this.title)
    .setDescription(msgLine.msg);

    this.embedAddAttachments(msgLine, embed);

    if (this.user.hasDiscordMember() &&
    this.script.config.scope == 'channel') {
      embed.setFooter(`${this.user.getDiscordMember().displayName}`, this.user.getDiscordUser().avatarURL());
    }

    await this.channel.send(embed);
  }

  /**
   * 
   * @param {*} currentLine 
   * @param {*} embed 
   */
  embedAddAttachments(msgLine, embed) {
    if (msgLine.thumb) {
      const thumb = msgLine.thumb;
      const thumbnail = new Discord.MessageAttachment('./images/' + thumb.path + thumb.fn, thumb.fn);

      embed.attachFiles(thumbnail)
      .setThumbnail(`attachment://${thumb.fn}`);
    }

    if (msgLine.img) {
      const img = msgLine.img;
      const image = new Discord.MessageAttachment('./images/' + img.path + img.fn, img.fn);

      embed.attachFiles(image)
      .setImage(`attachment://${img.fn}`);
    }
  }

  /**
   * 
   * @param {*} qsLine 
   */
  async askQuestion(qsLine) {
    const filter = (reaction, user) => user.id === this.user.getId() &&
    this.digits.some((digit) => reaction.emoji.name == digit);

    const embed = new Discord.MessageEmbed()
    .setColor('#FFA500')
    .setTitle(this.title)
    .setDescription(qsLine.qs);

    qsLine.ans.forEach((answer, index) => {
      embed.addField(`${this.digits[index]}`, `${answer.op}`, true);
    });

    this.embedAddAttachments(qsLine, embed);

    if (this.user.hasDiscordMember() &&
    this.script.config.scope == 'channel') {
      embed.setFooter(`${this.user.getDiscordMember().displayName}`, this.user.getDiscordUser().avatarURL());
    }

    const sentQuestion = await this.channel.send(embed);

    for await (const [index, ] of qsLine.ans.entries()) {
      await sentQuestion.react(this.digits[index]);
    }

    const answer = await sentQuestion.awaitReactions(filter, {max: 1, time: 240000, errors: ['time']})
    .catch(() => {
      this.questLog.status = 'saved';
      this.questLog.saveLabel = qsLine.lbl;
      database.updateQuest.run(this.questLog);

      const embed = new Discord.MessageEmbed()
      .setColor('#FFA500')
      .setTitle(this.title)
      .setDescription('Your progress is saved come back any time!');

      this.channel.send(embed);
    });

    if (answer && answer.first()) {
      const answerIndex = this.digits.indexOf(answer.first().emoji.name);
      const nextIndex = qsLine.ans[answerIndex].nxt;
      return nextIndex;
    } else {
      return undefined;
    }
  }

  /**
   * 
   * @param {*} ms 
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

};