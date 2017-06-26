// Function for generating random word based on the input

module.exports =  function (p_mode, p_word) {
  return {
    s_word : function(){
      let new_arr_words = [];
      var randomWord = "";

      switch(p_mode){
        case "easy":
          for (let i = 0; i < p_word.length; i++){
            if (p_word[i].length >3 && p_word[i].length < 7){
              new_arr_words.push(p_word[i]);
            }
          }
          break;
        case "normal":
          for (let i = 0; i < p_word.length; i++){
            if (p_word[i].length >5 && p_word[i].length < 9){
              new_arr_words.push(p_word[i]);
            }
          }
          break;

        case "hard":
          for (let i = 0; i < p_word.length; i++){
            if (p_word[i].length >8 && p_word[i].length < 15){
              new_arr_words.push(p_word[i]);
            }
          }
          break;

          default:
            new_arr_words = p_word;
            break;
      }

      randomWord = new_arr_words[Math.floor(Math.random() * new_arr_words.length)];
      randomWord = randomWord.toUpperCase();

      console.log("Random Word:", randomWord);

      return (randomWord.split("")) ;
    }
  }
}
