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
};