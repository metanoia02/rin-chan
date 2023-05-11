const RandomOrg = require('random-org');
const config = require('../tokens.js');

module.exports = new RandomOrg({apiKey: config.randomkey});
