var orange = {
    hunger: 1,
    config: require("./config.json"),

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
                    hunger--;
                    break;
                case 2:
                    message.channel.send(`I'm starving! What took you so long`);
                    orangeTry.oranges--;
                    hunger--;
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
            orangeTry.tries--;
    
            message.channel.send('Gotcha');
        } else {
            orangeTry.tries--;
            message.channel.send('Bad luck');
        }
    
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

module.exports = orange