const RandomOrg = require('random-org');
const config = require('../config.js');

module.exports = new RandomOrg({apiKey: config.randomkey});
