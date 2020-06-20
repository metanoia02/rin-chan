module.exports = class Reaction {
    constructor(filePath, modifier) {
        this.config = require(filePath);
    }
    
    getReaction(rinchan, user) {
        let answers = [];

        let modifiers = this.config.modifiers;

        let mood = rinchan.getMood();
        let hunger = rinchan.getHunger();
        let affection = user.affection;

        if(this.config.hasOwnProperty('responses')) {
            answers = this.config.responses.filter(response => {
                let moodFulfilled = true;
                let hungerFulfilled = true;
                let affectionFulfilled = true;
                
                if(response.includes('mood')) {
                    moodFulfilled = module.exports.checkFulfilled(response.mood, mood);
                }
                if(response.includes('hunger')) {
                    hungerFulfilled = module.exports.checkFulfilled(response.hunger, hunger);
                }
                if(response.includes('affection')) {
                    affectionFulfilled = module.exports.checkFulfilled(response.affection, affection);
                }          
    
                return moodFulfilled && hungerFulfilled && affectionFulfilled;
            });
        }

        let answer = {};
        let reaction = {};

        if(answers.length === 0) {
            reaction.string = arrayRandom(this.config.default);
        } else {
            answer = arrayRandom(answers);

            reaction.string = arrayRandom(answer.response);
            if(answer.hasOwnProperty('followUp')) {
                reaction.string += ' ' + arrayRandom(answer.followUp);
            }
        }      

        if(answer.hasOwnProperty("image")) {
            reaction.image = this.config.images.path + answer.image + '.jpg';
            reaction.imageName = answer.image + '.jpg';
        } else if(this.config.hasOwnProperty('images')) {          
            reaction.imageName = (Math.floor(Math.random() * this.config.images.quantity) + 1) + '.jpg';
            reaction.image = this.config.images.path + reaction.imageName;						
        }
        return reaction;
    }

    checkFulfilled(modifier, checkValue) {
        if(typeof modifier === 'object') {
            return checkValue >= modifier.min && checkValue <= modifier.max;
        } else {
            return modifier === checkValue;
        }
    }
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


/*
mood 0-5
    angrey
    sad
    neutral
    ok
    good
    amazing*/

//modifier = [mood,hunger,affection]

//midnight random mood
//hunger level decrease mood by 1 each hour less than 3