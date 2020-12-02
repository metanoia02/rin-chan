const database = require('./sql.js');
const entityManager = require('./entityManager.js');
const CommandException = require('./CommandException.js');
const config = require('../config');
const Discord = require('discord.js');
const utils = require('./utils');

module.exports = class User {
  /**
   * @param {Discord.Message} message
   * @param {string} userId
   * @param {string} guildId
   */
  constructor(message, userId, guildId) {
    if (userId && guildId) {
      this._user = database.getUser(userId, guildId);
    } else {
      this._user = database.getUser(message.author.id, message.guild.id);
    }

    if (message) {
      if (!userId) {
        if (message.member) this._discordMember = message.member;
        this._discordUser = message.author;
      } else {
        this._discordUser = message.client.users.cache.get(userId);
        this._discordMember = message.guild.members.cache.get(userId);
        if (!this._discordUser) {
          throw new CommandException('Who are they?', 'rinwha.png');
        }
      }
    }
  }

  /**
   * @return {string} Discord nickname or if not available the username
   */
  getNickname() {
    if (this._discordMember) {
      return this._discordMember.displayName;
    } else {
      return this._discordUser.username;
    }
  }

  /**
   *
   * @param {*} property
   * @param {*} value
   */
  _setProperty(property, value) {
    if (typeof value != 'number') throw new Error('Modifier must be number');
    if (value < 0) throw new Error(`Tried to set ${property} below zero`);

    this._user[property] = value;
    database.setUser.run(this._user);
  }

  /**
   * @param {string} EntityName Name of Entity
   * @param {number} modifier +/- modifier of Entity quantity
   */
  changeEntityQuantity(entityId, modifier) {
    if (typeof modifier != 'number') throw new Error('Modifier must be number');
    if (modifier == 0) throw new Error('Modifier was 0');
    if (!entityManager.isEntity(entityId)) throw new Error(`Invalid Entity: ${entityId}`);

    const inventory = database.getInventoryEntity(this._user, entityId);
    if (inventory.quantity + modifier < 0) throw new Error('Tried to set quantity below zero');

    inventory.quantity += modifier;
    database.setInventory.run(inventory);
  }
  /**
   * @param {string} entityId Entity to get quantity of
   * @return {number} Quantity of Entity in users inventory
   */
  getEntityQuantity(entityId) {
    if (!entityManager.isEntity(entityId)) throw new Error(`Invalid Entity: ${entityId}`);

    const inventory = database.getInventoryEntity(this._user, entityId);
    return inventory.quantity;
  }
  /**
   *
   * @param {*} entityId
   */
  setEntityLastGet(entityId) {
    if (!entityManager.isEntity(entityId)) throw new Error(`Invalid Entity: ${entityId}`);

    const inventory = database.getInventoryEntity(this._user, entityId);
    const now = new Date();

    inventory.lastGet = now.getTime();
    database.setInventory.run(inventory);
  }

  /**
   * @return {Array} Array of all inventory Entitys
   */
  getInventory() {
    return database.showInventory.all(this._user.id);
  }

  /** Get Discord User ID
   * @return {number}
   */
  getId() {
    return parseInt(this._user.user);
  }
  /**
   *
   * @param {number} modifier
   */
  changeAffection(modifier) {
    if (modifier == 0) throw new Error('Modifier was 0');
    this._setProperty('affection', utils.clamp(0, 100, this.getAffection() + modifier));
  }
  /**
   * @return {number}
   */
  getAffection() {
    return this._user.affection;
  }
  /**
   *
   * @param {integer} newAffection New affection
   */
  setAffection(newAffection) {
    if (newAffection > 100) throw new Error('Cannot set affection over 100');
    this._setProperty('affection', newAffection);
  }

  /**
   * @return {Discord.User} Discord user Entity
   */
  getDiscordUser() {
    return this._discordUser;
  }

  /**
   * @return {Discord.GuildMember} Discord member Entity
   */
  getDiscordMember() {
    if (this._discordMember) return this._discordMember;
    throw new Error('No member for user available');
  }
  /**
   * Checks if a discord member Entity is available for this user
   * @return {Boolean} Member exists or not
   */
  hasDiscordMember() {
    return this._discordMember ? true : false;
  }

  /**
   * @return {Number} User tries left
   */
  getTries() {
    return this._user.tries;
  }
  /**
   *
   * @param {*} newTries
   */
  setTries(newTries) {
    this._setProperty('tries', newTries);
  }
  /**
   *
   * @param {*} modifier
   */
  changeTries(modifier) {
    if (modifier == 0) throw new Error('Modifier was 0');
    this._setProperty('tries', this.getTries() + modifier);
  }

  /**
   * @return {Number} Time of last give in milliseconds
   */
  getLastGive() {
    return this._user.lastGive;
  }
  /**
   * Set a new last give time at current time
   */
  setLastGive() {
    const currentTime = new Date();
    this._setProperty('lastGive', currentTime.getTime());
  }

  /**
   * @return {Number} Last steal time in milliseconds
   */
  getLastSteal() {
    return this._user.lastSteal;
  }
  /**
   * Set last steal time to current time
   */
  setLastSteal() {
    const currentTime = new Date();
    this._setProperty('lastSteal', currentTime.getTime());
  }

  /**
   * @return {Number} Last harvest time in milliseconds
   */
  getLastHarvest() {
    return this._user.lastHarvest;
  }
  /**
   *
   * @param {Number} newLastHarvest New last harvest time in milliseconds
   */
  setLastHarvest(newLastHarvest) {
    this._setProperty('lastHarvest', newLastHarvest);
  }

  /**
   * @return {Boolean} User is booster
   */
  getIsBooster() {
    return Boolean(this._user.isBooster);
  }
  /**
   * @param {Boolean} newIsBooster
   */
  setIsBooster(newIsBooster) {
    this._setProperty('isBooster', newIsBooster ? 1 : 0);
  }

  // level stuffs
  /**
   * @return {Number} users current xp
   */
  getXp() {
    return this._user.xp;
  }

  /**
   * Returns calculated level index
   * @return {config.levels}
   */
  getLevel() {
    return config.levels.findIndex((ele) => this.getXp() >= ele.xp);
  }

  /**
   * @return {Number} Users current xp
   */
  getXp() {
    return this._user.xp;
  }
  /**
   * Adds xp to user and updates level if needed
   * @param {Number} addedXp
   * @param {Discord.Message} message
   */
  async addXp(addedXp, message) {
    if (this.getDiscordMember().roles.length > 0) {
      if (addedXp < 0) throw new Error(`Can not remove experience.`);
      this._setProperty('xp', this.getXp() + addedXp);

      const calculatedLevelIndex = this.getLevel();

      if (!this.getDiscordMember().roles.cache.has(config.levels[calculatedLevelIndex].role)) {
        const newLevel = config.levels[calculatedLevelIndex];
        await this.getDiscordMember().roles.remove(config.levels[calculatedLevelIndex + 1].role, 'Level up');
        await this.getDiscordMember().roles.add(newLevel.role, 'Level up');

        const attachment = new Discord.MessageAttachment(`./images/emotes/rinverywow.png`, 'rinverywow.png');

        message.channel.send(
          new Discord.MessageEmbed()
            .setColor('#FFD700')
            .setTitle('Level up!')
            .setDescription(`You reached the rank of ${newLevel.name}.`)
            .attachFiles(attachment)
            .setThumbnail(`attachment://rinverywow.png`)
        );
      }
    }
  } 
};
