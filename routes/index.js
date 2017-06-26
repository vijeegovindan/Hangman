const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

// Define my Router
const express = require('express');
const router = express.Router();

router.get('/', function(req, res){

  req.session.given_word = [];
  req.session.guess_word = [];
  req.session.guessedLetters = [];
  req.session.num_chances_given = 8;

  var randomWord = "";

  let new_arr_words = [];

  switch(req.session.mode)
  {
    case "easy":
      for (let i = 0; i < words.length; i++){
        if (words[i].length >3 && words[i].length < 7){
          new_arr_words.push(words[i]);
        }
      }
      break;
    case "normal":
      for (let i = 0; i < words.length; i++){
        if (words[i].length >5 && words[i].length < 9){
          new_arr_words.push(words[i]);
        }
      }
      break;

    case "hard":
      for (let i = 0; i < words.length; i++){
        if (words[i].length >8 && words[i].length < 15){
          new_arr_words.push(words[i]);
        }
      }
      break;

      default:
        new_arr_words = words;
        break;
  }

  randomWord = new_arr_words[Math.floor(Math.random() * new_arr_words.length)];
  randomWord = randomWord.toUpperCase();

  console.log("Random Word:", randomWord);

  let s_word = randomWord.split("");
  req.session.given_word = s_word;

   for (let j = 0; j < req.session.given_word.length; j++) {
     req.session.guess_word.push('-');
   }

   res.render('index', {num_chances_given: req.session.num_chances_given,
                        guessedWord: req.session.guess_word,
                        mode: req.session.mode
                      });

});

router.post("/", function(req, res){

let error_messages = [];
let errors = "";

if(req.body.action == "makeaguess"){

req.checkBody("txt_Guess", "Please enter a valid guess").notEmpty();
req.checkBody("txt_Guess", "Please enter only alphabet").isAlpha(); // check if its an alphabet
req.checkBody("txt_Guess", "Please enter only one alphabet").isLength({max: 1});


errors = req.validationErrors();
if (errors) {
    errors.forEach(function(error) {
    error_messages.push(error.msg);
    });
    res.render("index", {errors: error_messages,
                        num_chances_given: req.session.num_chances_given,
                        mode: req.session.mode});
}
else {

    let letter = (req.body.txt_Guess).toUpperCase();
    let good = false;
    let repeat_Msg = "";
    let results = "";
    let out_of_guess = false;

    for (let j = 0; j < req.session.given_word.length; j++) {
        if(req.session.num_chances_given <= 8){
          if(req.session.given_word[j] == letter){
            req.session.guess_word[j] = letter;
            good = true;
          }
        }
    }

    if(!good){ req.session.num_chances_given--; } // Number of guesses

    if(parseInt(req.session.guessedLetters.indexOf(letter)) > -1){  // Redundant alphabet selection
      repeat_Msg = 'Already guessed, please try again';
    }
    else {
      req.session.guessedLetters.push(letter);
    }

    if(parseInt(req.session.num_chances_given) <= 0){
      out_of_guess = true;
      results =  (req.session.given_word.join('|') === req.session.guess_word.join('|'))? 'You win!' : 'You lose!';
    }

    if(req.session.guess_word.indexOf("-")== -1){
      results =  (req.session.given_word.join('|') === req.session.guess_word.join('|'))? 'You win!' : 'You lose!';
    }

    res.render("index", {guessedWord: req.session.guess_word,
                        guessedLetters: (req.session.guessedLetters).join(),
                        num_chances_given: req.session.num_chances_given,
                        chances_over: out_of_guess,
                        repeatMsg: repeat_Msg,
                        resultsMsg : results,
                        mode: req.session.mode
              });
   }
}
else if(req.body.action == "tryagain"){
    req.session.destroy();
    res.redirect("/");
}

});


module.exports = router;
