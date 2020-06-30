module.exports = {
  _config: {},
  _moodModule: require('./mood.js'),
  _hungerModule: require('./hunger.js'),
  _client: require('../bot.js'),

  init(configJson, client) {
    this._configJson = configJson;

    this._client = client;

    this.fs = require('fs');
    this._config = this.readFile(configJson);

    this._hungerModule.setIcon(this._client, this.getHunger());
    this.setCollecting(false);
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
  changeMood(moodModifier) {
    this._config.mood = this._moodModule.newMood(this.getMood() + moodModifier);
    this.writeFile(this._config);

    return this._config.mood;
  },

  getMaxHunger() {
    return this._config.maxHunger;
  },
  setMaxHunger(newMaxHunger) {
    this._config.maxHunger = newMaxHunger;
    this.writeFile(this._config);
  },

  getCollecting() {
    return this._config.id;
  },
  setCollecting(newCollecting) {
    this._config.collecting = newCollecting;
    this.writeFile(this._config);
  },
};

const schedule = require('node-schedule');

// eslint-disable-next-line no-unused-vars
const hungerInterval = schedule.scheduleJob('0 * * * *', function() {
  module.exports.setHunger(module.exports.getHunger() + 1);
});

// eslint-disable-next-line no-unused-vars
const randomMood = schedule.scheduleJob('0 0 * * *', function() {
  module.exports._setMood(module.exports._moodModule.randomMood(module.exports.getMood()));
});