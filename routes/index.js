const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

// Defining Router for index page
const express = require('express');
const router = express.Router();

// Generating random word based on mode level - easy, normal, hard
var gen_random_word = require('../models/gen_random_word.js');

// GET Function of Index Page
router.get('/', function(req, res){

  req.session.given_word = [];
  req.session.guess_word = [];
  req.session.guessedLetters = [];
  req.session.num_chances_given = 8;

  var s_randomWord = gen_random_word(req.session.mode, words); // Model is used to generate the random number
  req.session.given_word = s_randomWord.s_word();

  for (let j = 0; j < req.session.given_word.length; j++) {
     req.session.guess_word.push('-');
  }
  res.render('index', {num_chances_given: req.session.num_chances_given,
                        guessedWord: req.session.guess_word,
                        mode: req.session.mode
                      });

});

//POST method of Index Page
router.post("/", function(req, res){

  if(req.body.action == "makeaguess"){

  let error_messages = [];
  let errors = "";

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

// Module exports
module.exports = router;
