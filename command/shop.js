module.exports = {
    phrases: [
        'buy ([0-9]+) ([a-z]+)',
        'sell ([0-9]+) ([a-z]+)',
        'leave'
    ],

    goShopping(message, command, cmdRegex, rinchan) {
        message.channel.send("Ok let's go! <:smolrin:707284808333787197>");

        const filter = response => {
            return response.author.id === message.author.id;
        };

          message.channel.send(this.buildShopEmbed()).then(() => {
            message.channel.awaitMessages(filter, {max:5, time:60000, errors:['time']})
                .then(collected => {
                    console.log('test');

                    if(this.phrases[0].test(collected.content)) {
                        console.log('test2');
                        this.buyObject(message);
                    } else if(this.phrases[1].test(collected.content)) {
                        console.log('test2');
                        this.sellObject(message);
                    } else if(this.phrases[2].test(collected.content)) {
                        console.log('test2');
                        return;
                    }
                })
                .catch(collected => {
                    message.channel.send("I'm bored lets go")
                });
        });

    },

    async inShop(message) {
        let shopping = true;

        while(shopping) {

        }

        message.channel.send("Ok let's go home");
    },

    buyObject(message) {
        message.channel.send("Buy");
    },

    sellObject() {
        message.channel.send("Sell");
    },

    checkInStock() {

    },

    restock() {

    },

    makeSale() {

    },

    buildShopEmbed() {
        let nameEmebedString = "";
        let valueEmbedString = "";
        let stockEmbedString = "";

        let stock = rinchanSQL.getStock.all();
        let objects = rinchanSQL.getAllObjects.all();

        stock.forEach(ele => {
            nameEmebedString += ele.objectName + '\n';
            valueEmbedString += rinchanSQL.getObject(ele.objectName).value + '\n';
            stockEmbedString += ele.quantity + '\n';
        });

        const Discord = require('discord.js');
        return new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Orange Kingdom General Store')
        .setDescription('The best value every day for discerning Rinchans')
        .setThumbnail('http://media1.popsugar-assets.com/files/2014/01/02/666/n/1922195/574f46474ab2683d_shutterstock_498871092VjH1o.jpg.xxxlarge_2x/i/Oranges.jpg')
        .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Name', value:nameEmebedString, inline: true },
            { name: 'Price', value:valueEmbedString, inline: true },
            { name: 'Stock', value:stockEmbedString, inline: true }
        );
    },
};