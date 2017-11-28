document.addEventListener('keydown', function(event) {
    // check if key is a letter a-z
    if (event.keyCode >= 65 && event.keyCode <= 90) {
        game.guessLetter(String.fromCharCode(event.keyCode));
    }
});

var game = new Game();
game.startGame();

function Game() {
    var lettersGuessed = [];
    var guessWord = [];
    var maskedWord = [];
    var remainingGuesses = 6;
    var startingGuesses = 6;
    var screenHandler = new ScreenHandler();
    var wins = 0;
    var losses = 0;

    this.startGame = function() {
        console.log("Starting Game");
        this.createWord();
        screenHandler.updateGuessWord(maskedWord);
        screenHandler.updateRemainingGuesses(startingGuesses);
        screenHandler.updateWins(wins);
        screenHandler.updateLosses(losses);
    };

    this.createWord = function() {
        var word = new WordGenerator().generateWord();
        guessWord = word.toUpperCase().split("");
        console.log("Word is: " + guessWord);
        for (var i = 0; i < guessWord.length; i++) {
            maskedWord.push("_");
        }
    };

    this.guessLetter = function(letter) {
        // Can't guess the same letter multiple times
        if (!lettersGuessed.includes(letter)) {
            lettersGuessed.push(letter);

            var isCorrect = false;
            if (guessWord.includes(letter)) {
                this.updateWord(letter);
                isCorrect = true;
            }
            this.updateGuesses(isCorrect);
        }
    };

    this.updateWord = function(guessedLetter) {
        console.log("Guessed letter: " + guessedLetter);

        for (var i = 0; i < guessWord.length; i++) {
            console.log(guessWord[i]);
            console.log("Match: " + (guessWord[i] === guessedLetter));
            if (guessWord[i] === guessedLetter) {
                maskedWord[i] = guessedLetter;
                console.log(maskedWord.length);
                console.log(maskedWord);
            }
        }
        screenHandler.updateGuessWord(maskedWord);

    };

    this.updateGuesses = function(isCorrect) {
        if (!isCorrect) {
            remainingGuesses--;
        }
        screenHandler.updateGuessedLetters(lettersGuessed);
        screenHandler.updateRemainingGuesses(remainingGuesses);

    };

}

function ScreenHandler() {
    this.updateGuessWord = function(maskedWord) {
        // array to string for display
        document.getElementById("guess-word").innerHTML = maskedWord.join("");
    };

    this.updateGuessedLetters = function(letters) {
        document.getElementById("letters-guessed").innerHTML = letters;
    };

    this.updateRemainingGuesses = function(numGuesses) {
        document.getElementById("guesses-remaining").innerHTML = numGuesses;
    };

    this.updateWins = function(wins) {
        document.getElementById("wins").innerHTML = wins;
    }

    this.updateLosses = function(losses) {
        document.getElementById("losses").innerHTML = losses;
    }
}