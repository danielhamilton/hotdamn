import { v4 as uuidv4 } from "uuid";

interface Player {
  id: string;
  name: string;
}

interface AIPlayer extends Player {
  isAI: true;
  difficulty: "easy" | "medium" | "hard";
}

interface Game {
  code: string;
  players: Player[];
  currentPhase: "lobby" | "phrase" | "drawing" | "guessing" | "results";
  phrases: string[];
  drawings: string[];
  guesses: string[];
}

interface HighScore {
  playerName: string;
  score: number;
}

export class GameManager {
  private games: Map<string, Game> = new Map();
  private highScores: HighScore[] = [];

  createGame(
    playerName: string,
    playerId: string,
    aiPlayerCount: number = 3,
    aiDifficulty: "easy" | "medium" | "hard" = "medium",
  ): Game {
    const gameCode = this.generateGameCode();
    const game = new Game(gameCode, playerId);
    game.players.push({ id: playerId, name: playerName, isAI: false });

    // Add AI players
    for (let i = 0; i < aiPlayerCount; i++) {
      const aiPlayer: AIPlayer = {
        id: uuidv4(),
        name: `AI Player ${i + 1}`,
        isAI: true,
        difficulty: aiDifficulty,
      };
      game.players.push(aiPlayer);
    }

    this.games.set(gameCode, game);
    return game;
  }

  joinGame(
    gameCode: string,
    playerName: string,
    playerId: string,
  ): Game | null {
    const game = this.games.get(gameCode);
    if (game && game.players.length < 8) {
      // Assuming max 8 players
      game.players.push({ id: playerId, name: playerName });
      return game;
    }
    return null;
  }

  startGame(gameCode: string): Game | null {
    const game = this.games.get(gameCode);
    if (game && game.players.length >= 2) {
      // Minimum 2 players to start
      game.currentPhase = "drawing";
      return game;
    }
    return null;
  }

  private generateGameCode(): string {
    // Implement a method to generate a unique game code
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  }

  getPromptForGame(gameCode: string): string {
    // Implement logic to get or generate a prompt for the game
    const prompts = ["cat", "dog", "house", "tree", "car", "boat"];
    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  submitDrawing(gameCode: string, playerId: string, drawing: string) {
    const game = this.games.get(gameCode);
    if (game) {
      game.drawings.push({ playerId, drawing });
      if (this.isAITurn(game)) {
        this.handleAIDrawing(game);
      }
    }
  }

  getNextPlayer(gameCode: string): Player | null {
    const game = this.games.get(gameCode);
    if (game && game.currentPlayerIndex < game.players.length - 1) {
      return game.players[++game.currentPlayerIndex];
    }
    return null;
  }

  startGuessingPhase(gameCode: string) {
    const game = this.games.get(gameCode);
    if (game) {
      game.currentPhase = "guessing";
      game.currentPlayerIndex = 0;
    }
  }

  submitGuess(gameCode: string, playerId: string, guess: string) {
    const game = this.games.get(gameCode);
    if (game) {
      game.guesses.push({ playerId, guess });
      if (this.isAITurn(game)) {
        this.handleAIGuessing(game);
      }
    }
  }

  allGuessesSubmitted(gameCode: string): boolean {
    const game = this.games.get(gameCode);
    return game ? game.guesses.length === game.players.length - 1 : false;
  }

  getResults(gameCode: string): RoundResult[] {
    const game = this.games.get(gameCode);
    if (!game) return [];

    return game.drawings.map((drawing) => {
      const drawer = game.players.find((p) => p.id === drawing.playerId)!;
      const prompt = game.prompts[drawer.id];
      const guesses = game.guesses.map((guess) => {
        const guesser = game.players.find((p) => p.id === guess.playerId)!;
        const score = this.calculateScore(prompt, guess.guess);
        return { player: guesser.name, guess: guess.guess, score };
      });

      return { drawer: drawer.name, prompt, guesses };
    });
  }

  calculateScore(prompt: string, guess: string): number {
    // Implement your scoring logic here
    return prompt.toLowerCase() === guess.toLowerCase() ? 100 : 0;
  }

  canStartNextRound(gameCode: string): boolean {
    const game = this.games.get(gameCode);
    return game ? game.currentRound < game.totalRounds : false;
  }

  startNextRound(gameCode: string) {
    const game = this.games.get(gameCode);
    if (game) {
      game.currentRound++;
      game.currentPhase = "drawing";
      game.currentPlayerIndex = 0;
      game.drawings = [];
      game.guesses = [];
      game.prompts = this.generatePrompts(game.players.length);
    }
  }

  generatePrompts(count: number): string[] {
    // Implement logic to generate unique prompts for each player
    const allPrompts = [
      "cat",
      "dog",
      "house",
      "tree",
      "car",
      "boat",
      "sun",
      "moon",
      "star",
      "flower",
    ];
    return allPrompts.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  private isAITurn(game: Game): boolean {
    const currentPlayer = game.players[game.currentPlayerIndex];
    return "isAI" in currentPlayer && currentPlayer.isAI;
  }

  private handleAIDrawing(game: Game) {
    const currentPlayer = game.players[game.currentPlayerIndex] as AIPlayer;
    const prompt = game.prompts[currentPlayer.id];
    const aiDrawing = this.generateAIDrawing(prompt, currentPlayer.difficulty);
    this.submitDrawing(game.gameCode, currentPlayer.id, aiDrawing);
  }

  private generateAIDrawing(
    prompt: string,
    difficulty: "easy" | "medium" | "hard",
  ): string {
    // In a real implementation, this would generate an actual drawing
    // For now, we'll just return a placeholder image
    return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==`;
  }

  private handleAIGuessing(game: Game) {
    const currentPlayer = game.players[game.currentPlayerIndex] as AIPlayer;
    const aiGuess = this.generateAIGuess(
      game.currentDrawing,
      currentPlayer.difficulty,
    );
    this.submitGuess(game.gameCode, currentPlayer.id, aiGuess);
  }

  private generateAIGuess(
    drawing: string,
    difficulty: "easy" | "medium" | "hard",
  ): string {
    const allGuesses = [
      "cat",
      "dog",
      "house",
      "tree",
      "car",
      "boat",
      "sun",
      "moon",
      "star",
      "flower",
    ];

    switch (difficulty) {
      case "easy":
        // Random guess
        return allGuesses[Math.floor(Math.random() * allGuesses.length)];
      case "medium":
        // 50% chance of correct guess, 50% random
        return Math.random() < 0.5
          ? this.getCorrectGuess(drawing)
          : allGuesses[Math.floor(Math.random() * allGuesses.length)];
      case "hard":
        // 80% chance of correct guess, 20% close guess
        return Math.random() < 0.8
          ? this.getCorrectGuess(drawing)
          : this.getCloseGuess(drawing);
    }
  }

  private getCorrectGuess(drawing: string): string {
    // In a real implementation, this would analyze the drawing
    // For now, we'll just return a random guess
    const allGuesses = [
      "cat",
      "dog",
      "house",
      "tree",
      "car",
      "boat",
      "sun",
      "moon",
      "star",
      "flower",
    ];
    return allGuesses[Math.floor(Math.random() * allGuesses.length)];
  }

  private getCloseGuess(drawing: string): string {
    // In a real implementation, this would return a guess close to the correct answer
    // For now, we'll just return a random guess
    const allGuesses = [
      "cat",
      "dog",
      "house",
      "tree",
      "car",
      "boat",
      "sun",
      "moon",
      "star",
      "flower",
    ];
    return allGuesses[Math.floor(Math.random() * allGuesses.length)];
  }

  updateScores(
    gameCode: string,
    results: RoundResult[],
  ): Record<string, number> {
    const game = this.games.get(gameCode);
    if (!game) return {};

    results.forEach((result) => {
      result.guesses.forEach((guess) => {
        if (!game.scores[guess.player]) {
          game.scores[guess.player] = 0;
        }
        game.scores[guess.player] += guess.score;
      });
    });

    this.updateHighScores(game);

    return game.scores;
  }

  private updateHighScores(game: Game) {
    Object.entries(game.scores).forEach(([playerName, score]) => {
      const existingIndex = this.highScores.findIndex(
        (hs) => hs.playerName === playerName,
      );
      if (existingIndex !== -1) {
        if (score > this.highScores[existingIndex].score) {
          this.highScores[existingIndex].score = score;
        }
      } else {
        this.highScores.push({ playerName, score });
      }
    });

    this.highScores.sort((a, b) => b.score - a.score);
    this.highScores = this.highScores.slice(0, 10); // Keep only top 10
  }

  getHighScores(): HighScore[] {
    return this.highScores;
  }
}
