interface Player {
  id: string;
  name: string;
}

interface Game {
  code: string;
  players: Player[];
  currentPhase: "lobby" | "phrase" | "drawing" | "guessing" | "results";
  phrases: string[];
  drawings: string[];
  guesses: string[];
}

export class GameManager {
  private games: Map<string, Game> = new Map();

  createGame(gameCode: string): Game {
    const game: Game = {
      code: gameCode,
      players: [],
      currentPhase: "lobby",
      phrases: [],
      drawings: [],
      guesses: [],
    };
    this.games.set(gameCode, game);
    return game;
  }

  joinGame(gameCode: string, playerName: string, playerId: string): Game {
    let game = this.games.get(gameCode);
    if (!game) {
      game = this.createGame(gameCode);
    }
    game.players.push({ id: playerId, name: playerName });
    return game;
  }

  startGame(gameCode: string): Game | undefined {
    const game = this.games.get(gameCode);
    if (game) {
      game.currentPhase = "phrase";
    }
    return game;
  }

  submitPhrase(
    gameCode: string,
    playerId: string,
    phrase: string,
  ): Game | undefined {
    const game = this.games.get(gameCode);
    if (game) {
      game.phrases.push(phrase);
      if (game.phrases.length === game.players.length) {
        game.currentPhase = "drawing";
      }
    }
    return game;
  }

  submitDrawing(
    gameCode: string,
    playerId: string,
    drawing: string,
  ): Game | undefined {
    const game = this.games.get(gameCode);
    if (game) {
      game.drawings.push(drawing);
      if (game.drawings.length === game.players.length) {
        game.currentPhase = "guessing";
      }
    }
    return game;
  }

  submitGuess(
    gameCode: string,
    playerId: string,
    guess: string,
  ): Game | undefined {
    const game = this.games.get(gameCode);
    if (game) {
      game.guesses.push(guess);
      if (game.guesses.length === game.players.length) {
        game.currentPhase = "results";
      }
    }
    return game;
  }

  removePlayer(playerId: string): void {
    this.games.forEach((game, gameCode) => {
      game.players = game.players.filter((player) => player.id !== playerId);
      if (game.players.length === 0) {
        this.games.delete(gameCode);
      }
    });
  }

  getGame(gameCode: string): Game | undefined {
    return this.games.get(gameCode);
  }
}
