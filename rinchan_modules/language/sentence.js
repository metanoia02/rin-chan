const config = require('./config.json');

class Word {
    constructor(word, index) {
        this.word = word;
        this.index = index;
    }
}

class Sentence {
    constructor(sentence) {
        this.sentence = sentence;

        this.verb = [];
        this.determiner = [];
        this.preposition = [];
        this.noun = [];
        this.negative = [];
        this.pronoun = [];
        this.adjective = [];
        this.exclamation = [];

        let sentenceArray = sentence.split(" ");

        sentenceArray.forEach(element, index => {
            for(var k in config) {
                for(var i = 0; i < k.length; i++) {
                    if(element.match(k[i])) {
                        this[k].push(new Word(element, index));
                        return;
                    }
                }
            }
        });
    }
}