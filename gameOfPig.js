(function() {
  "use strict";

  // get relevant elements
  let numOfPlayers;
  let i;
  let count;
  let increase;
  const rerollNumber = document.createElement('p');
  const start = document.querySelector('#start');
  const game = document.querySelector('#game');
  const control = document.querySelector('#control');
  const score = document.querySelector('#score');
  const button = document.querySelector('#button');
  const winner = document.createElement('h1');
  const die1 = document.createElement('img');
  const die2 = document.createElement('img');
  const player = document.createElement('p');
  const heading = document.createElement('h1');
  const quit = document.createElement('button');
  quit.textContent = "Quit";
  const close = document.createElement('button');
  close.textContent = "Close";
  const startNew = document.createElement('button');
  startNew.textContent = ('Start New Game');
  const roll = document.createElement('button');
  roll.textContent = "Roll the dice";
  const snake = document.createElement('p');
  const reroll = document.createElement('button');
  reroll.textContent = "Reroll";
  const or = document.createElement('span');
  or.textContent = " or ";
  const pass = document.createElement('button');
  pass.textContent = "Pass";
  const next = document.createElement('button');
  next.textContent = "Next";


  // keep track of game data
  let gameData = {
    dice: ["./images/faceone.jpg", "./images/facetwo.jpg", "./images/facethree.jpg", "./images/facefour.jpg", "./images/facefive.jpg", "./images/facesix.jpg"],
    players: [],
    scores: [],
    firstPlayer: [],
    roll1: 0,
    roll2: 0,
    rollSum: 0,
    index: 0,
    gameEnd: 30
  };

  // generate interface for when game starts
  button.addEventListener("click", (e) => {
    e.preventDefault;

    participants(numOfPlayers);

    start.textContent = "";
    heading.textContent = "The game has started";
    start.appendChild(heading);
    start.appendChild(quit);

    control.appendChild(roll);
  });


  roll.addEventListener("click", async (e) => {
    e.preventDefault;
    
    count = 1;
    increase = 1;

    await rollDice();
    await gameLogic(count);
  });

  reroll.addEventListener("click", async (e) => {
    e.preventDefault;

    // rerollNumber.textContent = `Roll number ${count}`;
      game.removeChild(rerollNumber);

    if(count <= gameData.dice.length) {
      count++;
      increase += 0.5;
    }
    
    await rollDice();
    await gameLogic(count);
  });


  // generate players and decide first player
  const participants = (numOfPlayers) => {
    finalScore();
    numOfPlayers = parseInt(prompt("How many players do you want?"));
    if(numOfPlayers >= 2 && numOfPlayers <= 10) {
      for(let i = 1; i <= numOfPlayers; i++) {
        gameData.players.push(`Player ${i}`);
        gameData.scores.push(0);
        gameData.firstPlayer.push(Math.random());
      }

      

      // generate scoresheet
      scoresheet();

      // generate first player
      let max = 0;
      for(let current = 1; current <= gameData.firstPlayer.length; current++) {
        if(gameData.firstPlayer[max] < gameData.firstPlayer[current]) {
          max = current;
        }
      }
      player.textContent = `Roll the dice for ${gameData.players[max]}`;
      game.appendChild(player);
    }
    else {
      participants();
    }
  }

  // set score to end game
  const finalScore = () => {
    gameData.gameEnd = parseInt(prompt("At what score do you want the game to end?"));
    if(gameData.gameEnd < 30 || gameData.gameEnd > 100) {
      finalScore();
    }
  }

  const rollDice = () => {
    gameData.roll1 = Math.ceil((Math.random()* 6));
    gameData.roll2 = Math.ceil((Math.random()* 6));
    gameData.rollSum = gameData.roll1 + gameData.roll2;

    for(let i = 1; i <= gameData.dice.length; i++) {
      if(gameData.roll1 === i) {
        die1.src = gameData.dice[i - 1];
      }
      if(gameData.roll2 === i) {
        die2.src = gameData.dice[i - 1];
      }
    }
    if(game.die1){
      game.removeChild(die1);
      game.removeChild(die2);
    }
    game.appendChild(die1);
    game.appendChild(die2);
  };


  // handle core logic
  const gameLogic = (count) => {
    for(let i = 0; i < gameData.players.length; i++) {
      if(player.textContent === `Roll the dice for ${gameData.players[i]}`) {
        if(gameData.roll1 <= count && gameData.roll2 <= count) {
          gameData.scores[i] = 0;
          snake.textContent = `Sorry, both of your rolls were less than or equal to ${count}; score has reset to 0`;
          game.appendChild(snake);
          control.textContent = "";

          scoresheet();
          switchPlayer(i);
        }
        else if(gameData.roll1 <= count || gameData.roll2 <= count) {
          if(i === gameData.players.length - 1){
            snake.textContent = `Sorry, one of your rolls was less than or equal to ${count}; switching to ${gameData.players[0]}`;
          }
          else {
            snake.textContent = `Sorry, one of your rolls was less than or equal to ${count}; switching to ${gameData.players[i + 1]}`;
          }
          game.appendChild(snake);
          control.textContent = "";

          switchPlayer(i);
        }
        else {
          gameData.rollSum = parseInt(gameData.rollSum * increase); 
          gameData.scores[i] += gameData.rollSum;

          control.textContent = "";
          control.appendChild(reroll);
          control.appendChild(or);
          control.appendChild(pass);

          scoresheet();

          if(gameData.scores[i] < gameData.gameEnd) {
            rerollNumber.textContent = `Roll number ${count}`;
            game.appendChild(rerollNumber);
          }

          if(gameData.scores[i] >= gameData.gameEnd) {
            game.removeChild(player);
            control.textContent = "";
            score.textContent = "";
            winner.textContent = `${gameData.players[i]} wins with ${gameData.scores[i]} points`;
            score.appendChild(winner);
            start.textContent = "";
            heading.textContent = "The game has finished";
            start.appendChild(heading);
            start.appendChild(quit);
          }
        }
      }
    }
  };


  const switchPlayer = (i) => {
    setTimeout(() => {
      game.textContent = "";
      if(i === gameData.players.length - 1){
        player.textContent = `Roll the dice for ${gameData.players[0]}`;
      }
      else {
        player.textContent = `Roll the dice for ${gameData.players[i + 1]}`;
      }
      game.appendChild(player);
      control.appendChild(roll);
    }, 3000);
  };

  const scoresheet = () => {
    score.textContent = "";
    for(let i = 0; i < gameData.players.length; i++) {
      let text = document.createElement('p');
      text.textContent = `${gameData.players[i]} score: ${gameData.scores[i]}`;
      score.appendChild(text);
    }
  };

  quit.addEventListener("click", (e) => {
    e.preventDefault;


    const answer = confirm('Are you sure you want to quit?')
    if (answer === true) {
      location.reload();
    }
  });


  pass.addEventListener("click", (e) => {
    e.preventDefault;

    game.textContent = "";
    for(let i = 0; i < gameData.players.length; i++) {
      if(player.textContent === `Roll the dice for ${gameData.players[i]}`) {
        if(i === gameData.players.length - 1) {
          i = 0;
          player.textContent = `Roll the dice for ${gameData.players[i]}`;
        }
        else {
          i += 1;
          player.textContent = `Roll the dice for ${gameData.players[i]}`;
        }
        game.appendChild(player);
        control.textContent = "";
        control.appendChild(roll);
      }
    }
  });
}());