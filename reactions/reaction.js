module.exports = class Reaction {
    constructor(filePath, modifier) {
        this.config = require(filePath);
    }
    
    getReaction(rinchan, user = null) {
        let answers = [];

        let modifiers = this.config.modifiers;
        let mood = rinchan.getMood().value;
        let hunger = rinchan.getHunger();
        if(user) { let affection = user.affection; }

        if(this.config.hasOwnProperty('responses')) {
            answers = this.config.responses.filter(response => {
                let moodFulfilled = true;
                let hungerFulfilled = true;
                let affectionFulfilled = true;
                
                if(response.hasOwnProperty('mood')) {
                    moodFulfilled = this.checkFulfilled(response.mood, mood);
                }
                if(response.hasOwnProperty('hunger')) {
                    hungerFulfilled = this.checkFulfilled(response.hunger, hunger);
                }
                if(response.hasOwnProperty('affection') && user) {
                    affectionFulfilled = this.checkFulfilled(response.affection, affection);
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
            if(this.config.hasOwnProperty('followUp')) {
                reaction.string += ' ' + arrayRandom(this.config.followUp);
            }
        }      

        if(answer.hasOwnProperty("image")) {
            reaction.image = this.config.images.path + answer.image;
            reaction.imageName = answer.image;
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

//todo max min from rinchan

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