import React from "react";
import { Box, Text, Button, Flex } from "@radix-ui/themes";

interface GameLobbyProps {
  players: string[];
  isHost: boolean;
  onStartGame: () => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({
  players,
  isHost,
  onStartGame,
}) => {
  return (
    <Box>
      <Text size="5">Drawphone</Text>
      <Text size="2">Waiting for players...</Text>
      <Flex direction="column" gap="2">
        {players.map((player, index) => (
          <Text key={index}>{player}</Text>
        ))}
      </Flex>
      {isHost && <Button onClick={onStartGame}>Start Game</Button>}
    </Box>
  );
};

export default GameLobby;
