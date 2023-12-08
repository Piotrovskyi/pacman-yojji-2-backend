function run(enginePath, clientCodePath) {
  const gameModule = require(enginePath);
  const clientCode = require(clientCodePath);
  console.log('gameModule', gameModule)
  console.log('clientCode', clientCode)

  const game = gameModule.Game();
  const initialState = game.init();

  let newState = null;

  while(!newState?.gameOver) {
    const userResponse = clientCode.gameTick(
      initialState.layout,
      initialState.pacmanCurrentIndex,
      initialState.ghosts
    );
    game.setDirection(userResponse);

    newState = game.tick();
    if (newState.gameOver) {
      console.log(newState.gameOverStatus + " " + newState.score)
      return newState.score;
    }
  }
}

module.exports = run;