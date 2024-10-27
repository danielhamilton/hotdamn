import React from "react";
import { Box, Text, Flex, ScrollArea, Button } from "@radix-ui/themes";
import { motion } from "framer-motion";

interface ResultsScreenProps {
  drawings: string[];
  players: string[];
  onGameComplete: () => void;
}

export default function ResultsScreen({
  drawings,
  players,
  onGameComplete,
}: ResultsScreenProps) {
  return (
    <Box p="4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Text size="6" mb="4">
          Game Results
        </Text>
        <ScrollArea style={{ height: "70vh" }}>
          <Flex direction="column" gap="4">
            {drawings.map((drawing, index) => (
              <Box
                key={index}
                p="2"
                style={{ border: "1px solid #ccc", borderRadius: "8px" }}
              >
                <Text size="3" mb="2">
                  Round {index + 1} - {players[index % players.length]}&apos;s
                  drawing
                </Text>
                <img
                  src={drawing}
                  alt={`Round ${index + 1} drawing`}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </Box>
            ))}
          </Flex>
        </ScrollArea>
        <Button mt="4" onClick={onGameComplete}>
          Back to Lobby
        </Button>
      </motion.div>
    </Box>
  );
}
