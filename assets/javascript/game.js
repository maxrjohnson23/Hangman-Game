document.addEventListener('keydown', function(event) {
    // check if key is a letter a-z or space to start game
    if ((event.keyCode >= 65 && event.keyCode <= 90) && !game.isGameOver()) {
        game.guessLetter(String.fromCharCode(event.keyCode));
    } else if (event.key === " ") {
        game.startGame();
        // disable default spacebar scroll to bottom
        event.preventDefault();
    }
});


function Game() {
    var lettersGuessed = [];
    var guessWord = [];
    var maskedWord = [];
    var remainingGuesses = 6;
    var startingGuesses = 6;
    var wins = 0;
    var losses = 0;
    var gameOver = true;

    this.startGame = function() {
        // unlock game after resetting delay
        gameOver = false;
        screenHandler.hideInstructions();
        // Reset data for new game
        guessWord = [];
        maskedWord = [];
        lettersGuessed = [];
        remainingGuesses = 6;
        this.createWord();
        // Reset screen for new game
        screenHandler.drawPlatform();
        screenHandler.updateGuessWord(maskedWord);
        screenHandler.updateRemainingGuesses(startingGuesses);
        screenHandler.updateGuessedLetters(lettersGuessed);
        screenHandler.updateWins(wins);
        screenHandler.updateLosses(losses);
    };

    this.createWord = function() {
        var word = new WordGenerator().generateWord();
        guessWord = word.toUpperCase().split("");
        console.log("SPOILER!: The Word is: " + guessWord.join("").replace(" ","  "));
        for (var i = 0; i < guessWord.length; i++) {
            // Account for multiple-word answers
            if (guessWord[i] === " ") {
                maskedWord.push(" ");
            } else {
                maskedWord.push("_");
            }
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
            this.checkGameOver();
        }

    };

    this.updateWord = function(guessedLetter) {

        // Replace underscores as the word is uncovered
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
            // Update hangman drawing
            screenHandler.drawHangman(remainingGuesses);
        }
        screenHandler.updateGuessedLetters(lettersGuessed);
        screenHandler.updateRemainingGuesses(remainingGuesses);

    };

    this.checkGameOver = function() {
        if (!maskedWord.includes("_")) {
            wins++;
            // freeze game during animation
            gameOver = true;
            screenHandler.flashBanner("win");
            screenHandler.winAnimation();
            // scope trick to pass in this 
            var that = this;
            setTimeout(function() {
                that.startGame();
            }, 3000);

        } else if (remainingGuesses === 0) {
            losses++;
            gameOver = true;
            screenHandler.flashBanner("lose");
            // Display word on losing
            screenHandler.updateGuessWord(guessWord);
            var that = this;
            setTimeout(function() {
                that.startGame();
            }, 3000);
        }
    };

    this.isGameOver = function() {
        return gameOver;
    };

}

var screenHandler = {
    hideInstructions : function() {
        var instructions = document.getElementById("instructions");
        instructions.style.visibility = "hidden";
        instructions.classList.remove("animated");

    },
    updateGuessWord : function(maskedWord) {
        // aremove commas when displaying on screen
        console.log("Word: " + maskedWord.join(""));
        console.log("Word: " + maskedWord.join("").replace(" ", "   "));

        document.getElementById("guess-word").textContent = maskedWord.join("").replace(/\s/g, '\u00A0\u00A0');
    },
    updateGuessedLetters : function(letters) {
        document.getElementById("letters-guessed").innerHTML = letters;
    },

    updateRemainingGuesses : function(numGuesses) {
        document.getElementById("guesses-remaining").innerHTML = numGuesses;
    },

    updateWins : function(wins) {
        document.getElementById("wins").innerHTML = wins;
    },

    updateLosses : function(losses) {
        document.getElementById("losses").innerHTML = losses;
    },

    winAnimation : function() {
        var audio = new Audio('assets/sounds/vroom.mp3');
        audio.play();
        var car = document.getElementById("car");
        // trick to reset animations for next run
        car.classList.remove("zoomAround");
        car.offsetHeight;
        car.classList.add("zoomAround");
    },

    flashBanner : function(outcome) {
        var audio = new Audio('assets/sounds/tires.mp3');
        audio.play();
        var banner = document.getElementById("banner");
        if (outcome === "lose") {
            banner.innerHTML = "You Lose!!";
        } else {
            banner.innerHTML = "You Win!!";
        }
        banner.classList.remove("flash");
        // reset CSS animation
        banner.offsetHeight;
        banner.classList.add("flash");

    },

    drawPlatform : function() {
        var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");
        // clear canvas for new game
        ctx.beginPath();
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 4;
        // base
        ctx.moveTo(75, 200);
        ctx.lineTo(225, 200);
        // vertical 
        ctx.moveTo(100, 200);
        ctx.lineTo(100, 50);
        // top
        ctx.moveTo(100, 50);
        ctx.lineTo(175, 50);
        // rope
        ctx.moveTo(175, 50);
        ctx.lineTo(175, 75);
        ctx.stroke();
    },

    drawHangman : function(guessNumber) {
        var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");
        ctx.lineWidth = 4;

        switch (guessNumber) {
            case 5:
                // draw head
                ctx.beginPath();
                ctx.arc(175, 95, 20, 0, 2 * Math.PI);
                ctx.stroke();
                break;
            case 4: 
                // draw body
                ctx.moveTo(175, 115);
                ctx.lineTo(175, 160);
                ctx.stroke();
                break;
            case 3: 
                // draw left arm
                ctx.moveTo(175, 130);
                ctx.lineTo(145, 120);
                ctx.stroke();
                break;
            case 2: 
                // draw right arm
                ctx.moveTo(175, 130);
                ctx.lineTo(205, 120);
                ctx.stroke();
                break;
            case 1: 
                // draw left leg
                ctx.moveTo(175, 160);
                ctx.lineTo(145, 190);
                ctx.stroke();
                break;
            case 0: 
                // draw right leg
                ctx.moveTo(175, 160);
                ctx.lineTo(205, 190);
                ctx.stroke();
                break;

        }       
    }
}

// Initialize the canvas drawing
var game = new Game();
screenHandler.drawPlatform();
