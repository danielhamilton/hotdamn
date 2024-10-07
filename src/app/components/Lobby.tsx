import React, { useState } from "react";
import { Button, Flex, Text, TextField, Box } from "@radix-ui/themes";
import { useGame } from "../../context/GameContext";

const Lobby: React.FC = () => {
  const {
    partyCode,
    players = [],
    addPlayer,
    removePlayer,
    setGameState,
  } = useGame();
  const [playerName, setPlayerName] = useState("");

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      addPlayer(playerName.trim(), false);
      setPlayerName("");
    }
  };

  const handleAddBot = () => {
    const botName = `Bot${players.length + 1}`;
    addPlayer(botName, true);
  };

  const handleRemovePlayer = (name: string) => {
    removePlayer(name);
  };

  const handleStartGame = () => {
    if (players.length >= 2) {
      setGameState("drawing");
    }
  };

  return (
    <Flex direction="column" gap="4">
      <Text size="5">Party Code: {partyCode}</Text>

      <Box>
        <Text size="4">Players:</Text>
        {players.map((player) => (
          <Flex key={player.name} justify="between" align="center">
            <Text>
              {player.name} {player.isBot ? "(Bot)" : ""}
            </Text>
            <Button
              size="1"
              color="red"
              onClick={() => handleRemovePlayer(player.name)}
            >
              Remove
            </Button>
          </Flex>
        ))}
      </Box>

      <Flex direction="column" gap="2">
        <Text size="3">Add Human Player:</Text>
        <Flex gap="2">
          <TextField.Root
            placeholder="Enter player name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          ></TextField.Root>
          <Button onClick={handleAddPlayer}>Add Player</Button>
        </Flex>
      </Flex>

      <Button onClick={handleAddBot}>Add Bot</Button>

      <Button
        onClick={handleStartGame}
        disabled={players.length < 2}
        size="3"
        color="green"
      >
        Start Game
      </Button>
    </Flex>
  );
};

export default Lobby;
