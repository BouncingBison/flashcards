// node dependencies 
var BasicCard = require('./basic.js');
var ClozeCard = require('./cloze.js');
var inquirer = require('inquirer');
var fs = require('fs');

inquirer.prompt([{
    name: 'command',
    message: 'would you like to view cards or add some?',
    type: 'list',
    choices: [{
        name: 'add-a-card'
    }, {
        name: 'show-cards'
    }]
}]).then(function(answer) {
    if (answer.command === 'add-a-card') {
        addCard();
    } else if (answer.command === 'show-cards') {
        showCards();
    }
});

var addCard = function() {
    // get user input
    inquirer.prompt([{
        name: 'cardType',
        message: 'what kind of flashcard would you like to make?',
        type: 'list',
        choices: [{
                name: 'basic-card'
            }, {
                name: 'cloze-card'
            }]
            // once user input is received
    }]).then(function(answer) {
        if (answer.cardType === 'basic-card') {
            inquirer.prompt([{
                name: 'front',
                message: 'What question will go on the front?',
                validate: function(input) {
                    if (input === '') {
                        console.log('input your question');
                        return false;
                    } else {
                        return true;
                    }
                }
            }, {
                name: 'back',
                message: 'please provide the answer',
                validate: function(input) {
                    if (input === '') {
                        console.log('try again, please provide an answer');
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function(answer) {
                var newBasic = new BasicCard(answer.front, answer.back);
                newBasic.create();
                nextThing();
            });
        } else if (answer.cardType === 'cloze-card') {
            inquirer.prompt([{
                name: 'text',
                message: 'what is the full text?',
                validate: function(input) {
                    if (input === '') {
                        console.log('please provide the full text');
                        return false;
                    } else {
                        return true;
                    }
                }
            }, {
                name: 'cloze',
                message: 'what is the cloze (hidden) portion?',
                validate: function(input) {
                    if (input === '') {
                        console.log('please provide the cloze portion');
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function(answer) {
                var text = answer.text;
                var cloze = answer.cloze;
                if (text.includes(cloze)) {
                    var newCloze = new ClozeCard(text, cloze);
                    newCloze.create();
                    startProcess();
                } else {
                    console.log('the cloze portion was not found in the full card\'s text, please check your input and try again');
                    addCard();
                }
            });
        }
    });
};

var startProcess = function() {
    // get user input
    inquirer.prompt([{
        name: 'next',
        message: 'what would you like to do next?',
        type: 'list',
        choices: [{
                name: 'create-new-card'
            }, {
                name: 'show-all-cards'
            }, {
                name: 'nothing'
            }]
            // once user input is received
    }]).then(function(answer) {
        if (answer.next === 'create-new-card') {
            addCard();
        } else if (answer.next === 'show-all-cards') {
            showCards();
        } else if (answer.next === 'nothing') {
            return;
        }
    });
};

var showCards = function() {
    // read the log.txt file
    fs.readFile('./log.txt', 'utf8', function(error, data) {
        //if there is an error, log it
        if (error) {
            console.log('an error occurred: ' + error);
        }
        var questions = data.split(';');
        var notBlank = function(value) {
            return value;
        };
        questions = questions.filter(notBlank);
        var count = 0;
        showQuestion(questions, count);
    });
};

var showQuestion = function(array, index) {
    question = array[index];
    var parsedQuestion = JSON.parse(question);
    var questionText;
    var correctReponse;
    if (parsedQuestion.type === 'basic') {
        questionText = parsedQuestion.front;
        correctReponse = parsedQuestion.back;
    } else if (parsedQuestion.type === 'cloze') {
        questionText = parsedQuestion.clozeDeleted;
        correctReponse = parsedQuestion.cloze;
    }
    inquirer.prompt([{
        name: 'response',
        message: questionText
    }]).then(function(answer) {
        if (answer.response === correctReponse) {
            console.log('that is correct!');
            if (index < array.length - 1) {
                showQuestion(array, index + 1);
            }
        } else {
            console.log('incorrect!');
            if (index < array.length - 1) {
                showQuestion(array, index + 1);
            }
        }
    });
};


var nextThing = function() {
    startProcess();

};
`                                 `