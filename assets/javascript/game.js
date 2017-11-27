document.addEventListener('keydown', function(event) {
    if (event.keyCode >= 65 && event.keyCode <= 90) {
        console.log("key was alpha");
        game.guessLetter(String.fromCharCode(event.keyCode));
    }
});

var game = new Game();
game.startGame();

function Game() {
    var lettersGuessed = new Array();
    var guessWord = [];
    var maskedWord = [];
    var remainingGuesses = 6;
    var screenHandler = new ScreenHandler();

    this.startGame = function() {
        console.log("Starting Game");
        this.createWord();
        screenHandler.updateGuessWord(maskedWord);
        screenHandler.updateRemainingGuesses(remainingGuesses);
    };

    this.createWord = function() {
        var word = new WordGenerator().generateWord();
        guessWord = word.toUpperCase().split("");
        console.log("Word is: " + guessWord);
        for(var i = 0; i < guessWord.length; i++) {
        	maskedWord.push("_");
        }
    };

    this.guessLetter = function(letter) {
        if (!lettersGuessed.includes(letter)) {
            lettersGuessed.push(letter);
            if(this.checkWord(letter)) {
            	console.log("Updating " + maskedWord);
            	screenHandler.updateGuessWord(maskedWord);
            }
            screenHandler.updateGuessedLetters(lettersGuessed);
            remainingGuesses--;
            screenHandler.updateRemainingGuesses(remainingGuesses);
        }
    };

    this.checkWord = function(guessedLetter) {
    	console.log("Guessed letter: " + guessedLetter );
    	if(guessWord.includes(guessedLetter)) {
    		for(var i = 0; i < guessWord.length; i++) {
    			console.log(guessWord[i]);
    			console.log("Match: " + (guessWord[i] === guessedLetter));
    			if(guessWord[i] === guessedLetter) {
    				maskedWord[i] = guessedLetter;
    				console.log(maskedWord.length);
    				console.log(maskedWord);
    			}
    		}
    		return true;
    	}
    	return false;
    };

}

function ScreenHandler() {
    this.updateGuessWord = function(maskedWord) {
        document.getElementById("guess-word").innerHTML = maskedWord.join("");
    };

    this.updateGuessedLetters = function(letters) {
        document.getElementById("letters-guessed").innerHTML = letters;
    };

    this.updateRemainingGuesses = function(guesses) {
        document.getElementById("guesses-remaining").innerHTML = guesses;
    };
}