import React from "react";
import { Button, Heading, Text, Flex, Avatar } from "@radix-ui/themes";

const GameLobby = ({ gameState, onStart }) => {
  return (
    <Flex direction="column" gap="4">
      <Heading size="6">Game Lobby - Code: {gameState.gameCode}</Heading>
      <Flex gap="2" wrap="wrap">
        {gameState.players.map((player, index) => (
          <Flex key={index} direction="column" align="center" gap="1">
            <Avatar
              fallback={player.name[0]}
              src={player.avatar}
              alt={player.name}
            />
            <Text size="1">{player.name}</Text>
          </Flex>
        ))}
      </Flex>
      {gameState.isHost && (
        <Button onClick={onStart} disabled={gameState.players.length < 4}>
          Start Game ({gameState.players.length}/4 players)
        </Button>
      )}
      {!gameState.isHost && <Text>Waiting for host to start the game...</Text>}
    </Flex>
  );
};

export default GameLobby;
