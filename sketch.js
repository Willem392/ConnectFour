let grid = [];
let available= [];

let p1 = 1;
let p2 = 2;
let curPlayer = p1;

let gameOver = 0;

function setup() {
  var canvas = createCanvas(700, 600);
  canvas.parent('sketch-holder');
  for(let i = 0; i < 7; i++){
    grid[i] = [];
    available[i] = [];
  }
  startGame();
}

function draw() {
  drawBoard();
  checkWinner();
  if (curPlayer == p2 && gameOver == 0) {
    computerTurn();
  }
  determineTitle();
}

function startGame() {
  gameOver = 0;
  curPlayer = p1;
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
      grid[i][j] = 0;
      available[i][j] = 0;
      if (j == 5) {
        available[i][j] = 1;
      }
    }
  }
}

function drawBoard() {
  background(23, 93, 222);
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
      if (grid[i][j] == p1) {
        fill(255, 0, 0);
      } else if (grid[i][j] == p2) {
        fill(255, 255, 0);
      } else {
        fill(19, 72, 162);
      }
      stroke(15, 59, 140);
      ellipse(i*(width/7) + (width/7)/2, j*(height/6) + (height/6)/2, width/7 - (width/7)*0.2, height/6 - (height/6)*0.2);
    }
  }
}

function placePiece(i, j, player) {
  grid[i][j] = player;
  available[i][j] = 0;
  if (j != 0)
    available[i][j-1] = 1;
}

function unplacePiece(i, j) {
  grid[i][j] = 0;
  available[i][j] = 1;
  if (j != 0)
    available[i][j-1] = 0;
}

function computerTurn() {
  let bestScore = -999;
  let bestMoveI = 0;
  let bestMoveJ = 0;
  let alpha = -999;
  let beta = 999;
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
      if (available[i][j] == 1) {
        placePiece(i, j, p2);
        let score = minimax(grid, 5, false, -999, 999);
        unplacePiece(i, j);
        if (score > bestScore) {
          bestScore = score;
          bestMoveI = i;
          bestMoveJ = j;
        }
        alpha = max(alpha, score);
        if (beta <= alpha) {
          break;
        }
      }
    }
  }
  placePiece(bestMoveI, bestMoveJ, p2);
  curPlayer = p1;
}

function minimax(grid, depth, isMaxing, alpha, beta) {
  checkWinner();
  let score = 0;
  if (depth == 0 || gameOver != 0) {
    if (gameOver == 1) {
      score = -1;
    } else if (gameOver == 2) {
      score = 1;
    } else if (gameOver == 3) {
      score = 0;
    }
    gameOver = 0;
    return score;
  }
  if (isMaxing) {
    let bestScore = -999;
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 6; j++) {
        if (available[i][j] == 1) {
          placePiece(i, j, p2);
          score = minimax(grid, depth - 1, false, alpha, beta);
          unplacePiece(i, j);
          bestScore = max(score, bestScore);
          alpha = max(alpha, score);
          if (beta <= alpha) {
            break;
          }
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = 999;
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 6; j++) {
        if (available[i][j] == 1) {
          placePiece(i, j, p1);
          score = minimax(grid, depth - 1, true, alpha, beta);
          unplacePiece(i, j);
          bestScore = min(score, bestScore);
          beta = min(beta, score);
          if (beta <= alpha) {
            break;
          }
        }
      }
    }
    return bestScore;
  }
}

function checkWinner() {
  let countP1 = 0;
  let countP2 = 0;
  let count = 0;
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
      if (grid[i][j] != 0) {
        count++;
      }
    }
  }
  if (count == 7*6) {
    gameOver = 3;
  }
  // horizontalCheck 
  for (let j = 0; j < 3; j++ ) {
    for (let i = 0; i < 7; i++) {
      if (grid[i][j] == p1 && grid[i][j+1] == p1 && grid[i][j+2] == p1 && grid[i][j+3] == p1) {
        gameOver = p1;
      }
      if (grid[i][j] == p2 && grid[i][j+1] == p2 && grid[i][j+2] == p2 && grid[i][j+3] == p2) {
        gameOver = p2;
      }
    }
  }
  // verticalCheck
  for (let i = 0; i < 4; i++ ) {
    for (let j = 0; j < 6; j++) {
      if (grid[i][j] == p1 && grid[i+1][j] == p1 && grid[i+2][j] == p1 && grid[i+3][j] == p1) {
        gameOver = p1;
      }
      if (grid[i][j] == p2 && grid[i+1][j] == p2 && grid[i+2][j] == p2 && grid[i+3][j] == p2) {
        gameOver = p2;
      }
    }
  }
  // ascendingDiagonalCheck 
  for (let i=3; i<7; i++) {
    for (let j=0; j<3; j++) {
      if (grid[i][j] == p1 && grid[i-1][j+1] == p1 && grid[i-2][j+2] == p1 && grid[i-3][j+3] == p1) {
        gameOver = p1;
      }
      if (grid[i][j] == p2 && grid[i-1][j+1] == p2 && grid[i-2][j+2] == p2 && grid[i-3][j+3] == p2) {
        gameOver = p2;
      }
    }
  }
  // descendingDiagonalCheck
  for (let i=3; i<7; i++) {
    for (let j=3; j<6; j++) {
      if (grid[i][j] == p1 && grid[i-1][j-1] == p1 && grid[i-2][j-2] == p1 && grid[i-3][j-3] == p1) {
        gameOver = p1;
      }
      if (grid[i][j] == p2 && grid[i-1][j-1] == p2 && grid[i-2][j-2] == p2 && grid[i-3][j-3] == p2) {
        gameOver = p2;
      }
    }
  }
}

function determineTitle() {
  let player;
  if (curPlayer == p1) {
    player = "Red";
  } else {
    player = "Yellow";
  }
  if (gameOver == 0) {
    
  } else if (gameOver == 1) {
    //surface.setTitle("Connect Four - Press 'SPACE' to restart - Red wins");
  } else if (gameOver == 2) {
    //surface.setTitle("Connect Four - Press 'SPACE' to restart - Yellow wins");
  } else if (gameOver == 3) {
    //surface.setTitle("Connect Four - Press 'SPACE' to restart - It's a tie!");
  }
}

function mousePressed() {
  if (curPlayer == p1 && gameOver == 0) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 6; j++) {
        if (mouseX > i*(width/7) && mouseX < (i+1)*(width/7)) {
          if (mouseY > j*(height/6) && mouseY < (j+1)*(height/6)) {
            let place = i;
            for (let k = 0; k < 6; k++) {
              if (available[place][k] == 1) {
                placePiece(place, k, p1);
                curPlayer = p2;
              }
            }
          }
        }
      }
    }
  }
}

function keyPressed() {
  if (key == ' ') {
    startGame();
  } else if (key == 'q' ) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 6; j++) {
        if (mouseX > i*(width/7) && mouseX < (i+1)*(width/7)) {
          if (mouseY > j*(height/6) && mouseY < (j+1)*(height/6)) {
            unplacePiece(i, j);
          }
        }
      }
    }
  } else if (key == 'w' ) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 6; j++) {
        if (mouseX > i*(width/7) && mouseX < (i+1)*(width/7)) {
          if (mouseY > j*(height/6) && mouseY < (j+1)*(height/6)) {
            placePiece(i, j, p2);
            curPlayer = p1;
          }
        }
      }
    }
  }
}
