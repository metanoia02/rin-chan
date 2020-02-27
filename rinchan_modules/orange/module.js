var orange = {
    hunger: 1,
    config: require("./config.json"),

    handler: function(message) { 
        if (orange.checkForEmote(message) && !message.author.bot && orange.hunger > 0) {
            message.channel.send('Who said orange?! Gimme!');
            return true;
        } else if (message.content.includes('🍊') && !message.author.bot && orange.hunger > 0) {
            message.channel.send(`That's my orange! Gimme!`);
            return true;
        } 

        return false;
    },

    checkForEmote: function(message) {
        var orangeTotal;
    
        if (message.content.match(/orange/gi) != null) {
            orangeTotal = message.content.match(/orange/gi).length;
        } else {
            return false;
        }
    
        var orangeEmotes = 0;
        var colon = false;
        var colonPosition;
        var emote;
    
        for (var i = 0; i < message.content.length; i++) {
            if (colon == false && message.content.charAt(i) == ':') {
                colon = true;
                colonPosition = i;
            } else if (colon == true && message.content.charAt(i) == ':') {
                emote = message.content.slice(colonPosition, i);
    
                if (emote.match(/orange/gi) != null && emote.match(/orange/gi).length > 0) {
                    orangeEmotes++;
                }
    
                colon = false;
            }
        }
    
        return (orangeTotal - orangeEmotes) > 0;
    },

    feedOrange: function(message) {
        let orangeTry = global.client.getOrange.get(message.author.id, message.guild.id);

        if (!orangeTry) {
            orangeTry = {
                id: `${message.guild.id}-${message.author.id}`,
                user: message.author.id,
                guild: message.guild.id,
                oranges: 0,
                affection: 0,
                tries: 3
            };
        }
    
        if (orangeTry.oranges < 1) {
            message.channel.send(`You don't have any oranges!`);
        } else {
            switch (orange.hunger) {
                case 0:
                    message.channel.send('Im stuffed, I cant eat another one');
                    break;
                case 1:
                    message.channel.send(`Thanks, I can't eat another bite`);
                    orangeTry.oranges--;
                    orange.hunger--;
                    break;
                case 2:
                    message.channel.send(`I'm starving! What took you so long`);
                    orangeTry.oranges--;
                    orange.hunger--;
                    break;
            }
        }
    
        global.client.setOrange.run(orangeTry);
    },

    harvestOrange: function(message) {
        let orangeTry = global.client.getOrange.get(message.author.id, message.guild.id);

        if (!orangeTry) {
            orangeTry = {
                id: `${message.guild.id}-${message.author.id}`,
                user: message.author.id,
                guild: message.guild.id,
                oranges: 0,
                affection: 0,
                tries: 3
            };
        }
    
        if (orangeTry.tries > 0) {
            if (Math.random() > 0.5) {
                orangeTry.oranges++;
                message.channel.send('Found an Orange!');
            } else {
                message.channel.send('Couldnt find anything');
            }

            orangeTry.tries--;
        } else {
            message.channel.send(`I'm tired! <:rinded:603549269106098186>`);
        }
    
        global.client.setOrange.run(orangeTry);
    },

    catchOrange: function(message) {
        //check tired 

        var user = message.author;
        var catching = true;

        message.channel.send(""); //intro

        catchMessage = message.channel.send(""); //ascii art

        message.channel.send(""); //ask to pick
    },

    catchChoice: function(message) {
        var pattern = [
            Math.round(Math.random()),
            Math.round(Math.random()),
            Math.round(Math.random()),
            Math.round(Math.random())
        ];
    
        setTimeout(function() {
            catchMessage.edit("");
        }, 1000);
    
        setTimeout(function() {
            catchMessage.edit("");
        }, 1000);
    
        setTimeout(function() {
            catchMessage.edit("");
        }, 1000);
    
        setTimeout(function() {
            catchMessage.edit("");
        }, 1000); //Final
    
        let orangeTry = global.client.getOrange.get(message.author.id, message.guild.id);
    
        if (!orangeTry) {
            orangeTry = {
                id: `${message.guild.id}-${message.author.id}`,
                user: message.author.id,
                guild: message.guild.id,
                oranges: 0,
                affection: 0,
                tries: 3
            };
        }
    
        if (pick == pattern[pick]) {
            orangeTry.oranges++;
   
            message.channel.send('Gotcha');
        } else {
            message.channel.send('Bad luck');
        }

        orangeTry.tries--;
    
        global.client.setOrange.run(orangeTry);
        catching = false;
    },

    hungry: function(message) {
        switch (orange.hunger) {
            case 0: {
                message.channel.send("Im stuffed <:rinchill:600745019514814494>");
                return;
            }
            case 1: {
                message.channel.send("Dont you have one more orange? <:oharin:601107083265441849>");
                return;
            }
            case 2: {
                message.channel.send("Im starving here! <:rinangrey:620576239224225835>");
                return;
            }
        }
        return;
    },

    test: function() {
        console.log("test");
    }
};

setInterval(function() {
    if (orange.hunger < config.maxHunger) {
        orange.hunger++;
    }
}, 57600000);

module.exports = orange