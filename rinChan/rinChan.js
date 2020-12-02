const database = require('../utils/sql');
const User = require('../utils/User');
const utils = require('../utils/utils');

module.exports = {
  _config: {},
  _moodModule: require('./mood.js'),
  _hungerModule: require('./hunger.js'),
  _client: require('../bot.js'),

  init(configJson, client) {
    this._configJson = configJson;

    this._client = client;
    this._discordUser = client.user;

    this.fs = require('fs');
    this._config = this.readFile(configJson);

    this._hungerModule.setIcon(this._client, this.getHunger());
    this.setCollecting(false);
  },

  getDiscordUser() {
    return this._discordUser;
  },

  readFile(path) {
    const data = this.fs.readFileSync(path);
    return JSON.parse(data);
  },
  writeFile(config) {
    const data = JSON.stringify(config);
    this.fs.writeFileSync(this._configJson, data);
  },

  getId() {
    return this._config.id;
  },
  setId(newId) {
    this._config.id = newId;
    this.writeFile(this._config);
  },

  getHunger() {
    return this._config.hunger;
  },
  setHunger(newHunger) {
    this._config.hunger = this._hungerModule.changeHunger(this._client, newHunger, this.getMaxHunger());
    this.writeFile(this._config);
  },

  getLastFed() {
    return this._config.lastFed;
  },
  setLastFed(newLastFed) {
    this._config.lastFed = newLastFed;
    this.writeFile(this._config);
  },

  getMood() {
    return this._config.mood;
  },
  _setMood(newMood) {
    this._config.mood = newMood;
    this.writeFile(this._config);
  },
  moodUp() {
    if (this._moodModule.moodUp(this._config)) {
      this._setMood(utils.clamp(0, 5, this.getMood() + 1));
    }
  },
  moodDown() {
    if (this._moodModule.moodDown(this._config)) {
      this._setMood(utils.clamp(0, 5, this.getMood() - 1));
    }
  },

  getMaxHunger() {
    return this._config.maxHunger;
  },
  setMaxHunger(newMaxHunger) {
    this._config.maxHunger = newMaxHunger;
    this.writeFile(this._config);
  },

  getCollecting() {
    return this._config.collecting;
  },
  setCollecting(newCollecting) {
    this._config.collecting = newCollecting;
    this.writeFile(this._config);
  },
};

const schedule = require('node-schedule');

// eslint-disable-next-line no-unused-vars
const hungerInterval = schedule.scheduleJob('0 * * * *', function () {
  const randomDelay = Math.floor(Math.random() * 3600000) + 1;

  setTimeout(() => {
    module.exports.setHunger(module.exports.getHunger() + 1);
  }, randomDelay);
});

// eslint-disable-next-line no-unused-vars
const randomMood = schedule.scheduleJob('0 0 * * *', function () {
  module.exports._setMood(module.exports._moodModule.randomMood(module.exports.getMood()));
  const users = database.getAllUsers.all();
  users.forEach((user) => {
    const thisUser = new User(undefined, user.user, user.guild);
    thisUser.changeAffection(-10);
  });
});
