document.addEventListener('keydown', function(event) {
    // check if key is a letter a-z or space to start game
    console.log(event.key);
    if (event.keyCode >= 65 && event.keyCode <= 90) {
        game.guessLetter(String.fromCharCode(event.keyCode));
    } else if (event.key === " ") {
        game.startGame();
        // disable space scroll to bottom
        event.preventDefault();
    }
});


function fadeIn(element) {
    // initial opacity
    var op =0.1;
    element.style.visibility = 'visible';
    element.style.opacity = op;
    // increase opacity over time
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}


var game = new Game();

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
        // Reset data for new game
        guessWord = [];
        maskedWord = [];
        lettersGuessed = [];
        remainingGuesses = 6;
        this.createWord();
        screenHandler.updateGuessWord(maskedWord);
        screenHandler.updateRemainingGuesses(startingGuesses);
        screenHandler.updateGuessedLetters(lettersGuessed);
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
        }
        this.updateGuesses(isCorrect);
        this.checkGameOver();
    };

    this.updateWord = function(guessedLetter) {

        for (var i = 0; i < guessWord.length; i++) {
            if (guessWord[i] === guessedLetter) {
                maskedWord[i] = guessedLetter;
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

    this.checkGameOver = function() {
        if (!maskedWord.includes("_")) {
            console.log("WIN!");
            wins++;
            //screenHandler.updateWins(wins);
            screenHandler.displayWinBanner();
            this.startGame();
        } else if (remainingGuesses === 0) {
            console.log("LOSE!");
            //screenHandler.updateLosses(losses);
            this.startGame();
        }
    }

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
    this.displayWinBanner = function() {
        var banner = document.getElementById("alert-banner");
        banner.innerHTML = "<p><strong>You win!<strong></p>";
        // fade(banner);
        // banner.style.visibility = 'hidden';
        fadeIn(banner);
    }
}