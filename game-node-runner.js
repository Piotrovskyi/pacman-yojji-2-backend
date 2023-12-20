const fs = require('fs');
function run(enginePath, clientCodePath) {
  const data = fs.readFileSync(clientCodePath, 'utf8');
  if (data.includes('require') || data.includes('eval')) {
    const err = new Error('require is not supported');
    err.stack = null;
    throw error;
  }

  const gameModule = require(enginePath);
  const clientCode = require(clientCodePath);

  const game = gameModule.Game();
  let newState = game.init();;
  const steps = [newState];

  while(!newState?.gameOver) {
    const userResponse = clientCode.gameTick(
      newState.layout,
      newState.pacmanCurrentIndex,
      newState.ghosts
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
}

module.exports = run;
