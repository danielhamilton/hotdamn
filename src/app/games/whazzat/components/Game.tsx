import { useState, useEffect } from "react";
import { supabase } from "../../../supabase";
import PromptLibrary from "./PromptLibrary";

// ... other imports and type definitions

export default function Game({ gameId, playerId }: GameProps) {
  // ... existing state
  const [promptLibrary, setPromptLibrary] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("common");
  const [errorCount, setErrorCount] = useState(0);

  const fetchGameData = async () => {
    try {
      const { data, error } = await supabase
        .from("games")
        .select(
          `
          id,
          status,
          current_round,
          current_player_index,
          players (id, name)
        `,
        )
        .eq("id", gameId)
        .single();

      if (error) throw error;

      if (data) {
        console.log("Fetched game data:", data);
        setCurrentPlayerIndex(data.current_player_index);
        setCurrentRound(data.current_round);
        if (data.players) {
          setPlayers(data.players);
        }
      }
    } catch (error) {
      console.error("Error fetching game data:", error);
    }
  };

  useEffect(() => {
    if (gameId) {
      const intervalId = setInterval(fetchGameData, 10000); // Poll every 10 seconds
      return () => clearInterval(intervalId);
    }
  }, [gameId]);

  const handleSubmit = async (drawingData: string) => {
    try {
      const { data, error } = await supabase.from("drawings").insert({
        game_id: gameId,
        player_id: currentPlayerId,
        image_data: drawingData,
      });

      if (error) throw error;
      console.log("Drawing submitted successfully:", data);

      // Update game state after successful submission
      await updateGameState();
    } catch (error) {
      console.error("Error submitting drawing:", error);
    }
  };

  const updateGameState = async () => {
    try {
      const { data, error } = await supabase
        .from("games")
        .update({
          current_player_index: (currentPlayerIndex + 1) % totalPlayers,
        })
        .eq("id", gameId);

      if (error) throw error;
      console.log("Game state updated:", data);

      // Fetch updated game data
      await fetchGameData();
    } catch (error) {
      console.error("Error updating game state:", error);
    }
  };

  return (
    <div>
      {/* ... existing game UI */}
      <PromptLibrary
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onSelectPrompt={(prompt) => {
          /* Set the prompt for the current round */
        }}
      />
      {/* Drawing component with submit handler */}
    </div>
  );
}

console.log("Game ID type:", typeof gameId);
console.log("Game ID value:", gameId);
console.log("Current game ID:", gameId);
