const database = require('./sql.js');
const objectManager = require('./objectManager.js');
const CommandException = require('./CommandException.js');

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
   * @param {string} objectName Name of object
   * @param {number} modifier +/- modifier of object quantity
   */
  changeObjectQuantity(objectName, modifier) {
    if (typeof modifier != 'number') throw new Error('Modifier must be number');
    if (modifier == 0) throw new Error('Modifier was 0');
    if (!objectManager.isObject(objectName)) throw new Error(`Invalid object: ${objectName}`);

    const inventory = database.getInventory(this._user, objectName);
    if (inventory.quantity + modifier < 0) throw new Error('Tried to set quantity below zero');

    inventory.quantity += modifier;
    database.setInventory.run(inventory);
  }
  /**
   * @param {string} objectName Object to get quantity of
   * @return {number} Quantity of object in users inventory
   */
  getObjectQuantity(objectName) {
    if (!objectManager.isObject(objectName)) throw new Error(`Invalid object: ${objectName}`);

    const inventory = database.getInventory(this._user, objectName);
    return inventory.quantity;
  }
  /**
   *
   * @param {*} objectName
   */
  setObjectLastGet(objectName) {
    if (!objectManager.isObject(objectName)) throw new Error(`Invalid object: ${objectName}`);

    const inventory = database.getInventory(this._user, objectName);
    const now = new Date();

    inventory.lastGet = now.getTime();
    database.setInventory.run(inventory);
  }

  /**
   * @return {Array} Array of all inventory objects
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
    this._setProperty('affection', this.getAffection() + modifier);
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
    this._setProperty('affection', newAffection);
  }

  /**
   * @return {Discord.User} Discord user object
   */
  getDiscordUser() {
    return this._discordUser;
  }

  /**
   * @return {Discord.GuildMember} Discord member object
   */
  getDiscordMember() {
    if (this._discordMember) return this._discordMember;
    throw new Error('No member for user available');
  }
  /**
   * Checks if a discord member object is available for this user
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
  /*
  checkLevel() {
    // get current xp
    // check against level table
    // make changes if needed
  }
  getXp() {
    return this._user.xp;
  }
  addXp(addedXp, message) {
    this._setProperty('xp', this.getXp() + addedXp);
  }*/
};
