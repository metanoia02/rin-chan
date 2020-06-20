let template = {
    "images": //optional for images, if declared and responses have no image property a random image is selected each time
    { 
        "path": "./images/cute/", 
        "quantity": 8
    },

    "modifiers": ["mood", "affection", "hunger"], //attributes to be checked to fulfill requirements of response

    "default": ["That's really nice of you...", "Thanks"], //default responses for if no valid response is found based on modifiers 

    "responses": [
        {
            "affection": {"min": 50,"max": 9999}, //format as object with min max or integer with fixed value
            "mood": {"min": 4,"max": 5},
            "hunger": {"min": 3,"max": 5},

            "response": ["I love you!"],
            "image": 1
        },
    ]
};
