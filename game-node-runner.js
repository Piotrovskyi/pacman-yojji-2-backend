const fs = require('fs');
function run(enginePath, clientCodePath) {
  fs.readFile(clientCodePath, 'utf8', function(error, data) {
    if (data.includes('require') || data.includes('eval') || error) {
      const err = new Error('require is not supported');
      err.stack = null;
      throw error || err;
    }

    const gameModule = require(enginePath);
    const clientCode = require(clientCodePath);
    const game = gameModule.Game();
    const initialState = game.init();
    const steps = [initialState];
  
    let newState = null;
  
    while(!newState?.gameOver) {
      const userResponse = clientCode.gameTick(
        initialState.layout,
        initialState.pacmanCurrentIndex,
        initialState.ghosts
      );
      game.setDirection(userResponse);
  
      newState = game.tick();
      steps.push(newState)
      if (newState.gameOver) {
        console.log(newState.gameOverStatus + " " + newState.score)
        return {
          score: newState.score,
          steps
        };
      }
    }
  })
}

module.exports = run;
