module.exports = class Reaction {
    constructor(filePath) {
        this.config = require(filePath);
    }
    
    getReaction() {
        let answer = "";

        for(let phraseArr in this.config) {
            let index  = Math.floor(Math.random() * (this.config[phraseArr].length));

            answer += this.config[phraseArr][index];
        }

        return answer;
    }

    //mood
    //affection
    //hunger
};

/*
mood 0-5
    angrey
    sad
    neutral
    ok
    good
    amazing
hunger 0-5
    rinangrey
    rinpout
    flap
    flapflap
    turboflap
    stuffed
affection 0-5
    0
    20
    40
    60
    80
    100

    

*/