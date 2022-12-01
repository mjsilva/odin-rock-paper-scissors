// constants
const HUMAN = "human";
const COMPUTER = "computer";
const TIE = "tie";

const outcomeToEmoji = {
  rock: "✊🏼",
  paper: "🖐🏼",
  scissors: "✌🏼",
};

// helpers
const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

// game logic

/**
 * [getRandomPlayOutcome description]
 *
 * @return  {[string]}  returns rock paper or scissors randomly
 */
const getRandomPlayOutcome = () => {
  const possibleOutcomes = Object.keys(outcomeToEmoji);
  const result = possibleOutcomes[Math.ceil(Math.random() * 3) - 1];

  return result;
};

/**
 * Changes rock paper scissors value on computer side
 * There's a bit of a nasty with a callback because i didn't
 * wanted to got through all the async stuff here.
 *
 * @param   {[string]}  rspValue  the string value of rock paper scissor symbol ie "rock"
 * @param   {[void]}  callback  a callback to be executed after change the value
 *
 * @return  {[void]}
 */
const changeComputerSymbol = (rspValue, callback) => {
  const elComputerPlay = document.querySelector(".computer .play-card");
  (function loopyLoop(i) {
    setTimeout(function () {
      elComputerPlay.innerHTML = outcomeToEmoji[getRandomPlayOutcome()];
      if (--i) {
        loopyLoop(i);
      } else {
        document.querySelector(".computer .play-card").innerHTML =
          outcomeToEmoji[rspValue];
        callback();
      }
    }, 100);
  })(20);
};

/**
 * Determines the winner of rock paper scissors (lizard, spok)
 * returns as early as possible to avoid nastings (nestings ha!)
 *
 * @param   {[string]}  computerValue  value for human ie "rock"
 * @param   {[string]}  humanValue     value for robot ie "scissors"
 *
 * @return  {[string]}                 returns a string with the result (tie | human | computer)
 */
const determineWinner = (computerValue, humanValue) => {
  if (computerValue === humanValue) {
    return TIE;
  }

  // kill all humans!
  const humanDefeatedBy = {
    rock: "paper",
    paper: "scissors",
    scissors: "rock",
  };

  if (humanDefeatedBy[humanValue] === computerValue) {
    return COMPUTER;
  }

  return HUMAN;
};

/**
 * Game on, main gaming logic coordinator.
 * Like the game middle manager.
 *
 * @param   {[string]}  elHumanValue  the html element the human cliked on
 *
 * @return  {[void]}
 */
const game = (elHumanValue) => {
  const roundComputerValue = getRandomPlayOutcome();
  const humanValue = getKeyByValue(
    outcomeToEmoji,
    elHumanValue.target.innerHTML
  );

  changeComputerSymbol(roundComputerValue, () => {
    updateGameWithResults(determineWinner(roundComputerValue, humanValue));
    setTimeout(() => {
      document.querySelector(".round-options-modal").classList.remove("hide");
      document.querySelector(".page-mask").classList.remove("hide");
    }, 2000);
  });
};

/**
 * Updates game results where they need to be updated
 *
 * @param   {[string]}  whoWon  a string of the winner ie "human"
 *
 * @return  {[void]}
 */
const updateGameWithResults = (whoWon) => {
  if (whoWon === TIE) {
    [...document.querySelectorAll(".result")].forEach((el) => {
      el.innerHTML = whoWon;
      el.classList.remove("hide");
    });
    return;
  }

  const elResultWinner = document.querySelector(`.result.${whoWon}`);
  elResultWinner.innerHTML = "WINNER";
  elResultWinner.classList.remove("hide");

  const currentScore = document.querySelector(`.${whoWon} .score`).innerHTML;
  document.querySelector(`.${whoWon} .score`).innerHTML = +currentScore + 1;
};

/**
 * Restarts the game with everything zeroed
 *
 * @return  {[void]}
 */
const restartGame = () => {
  [...document.querySelectorAll(".score")].forEach((el) => {
    el.innerHTML = 0;
  });
  nextGame();
};

/**
 * Does all the necessary UI changes for next round
 *
 * @return  {[void]}
 */
const nextGame = () => {
  document.querySelector(`.round-options-modal`).classList.add("hide");
  document.querySelector(`.page-mask`).classList.add("hide");
  [...document.querySelectorAll(".human .play-card")].forEach((el) => {
    el.classList.remove("hide-block");
    el.classList.remove("choice");
    el.style.display = "block";
  });

  [...document.querySelectorAll(".result")].forEach((el) => {
    el.classList.add("hide");
  });

  document.querySelector(`.computer .play-card`).innerHTML = "🦾";
};

// event listeners

// when a player clicks a card with rock, paper or scissors
[...document.querySelectorAll(".human .play-card")].forEach((el) => {
  el.addEventListener("click", game);
  el.addEventListener("click", () => {
    el.classList.add("choice");
    [...document.querySelectorAll(".human .play-card:not(.choice")].forEach(
      (el2) => {
        el2.style.display = "none";
      }
    );
  });
});

// when player clicks on restart or next round buttons
document
  .querySelector(".bto-restart-game")
  .addEventListener("click", restartGame);
document.querySelector(".bto-next-game").addEventListener("click", nextGame);
