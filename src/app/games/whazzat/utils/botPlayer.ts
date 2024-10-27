import { supabase } from "../../../supabase";

export const createBotPlayer = async (gameId: string) => {
  const botName = `Bot_${Math.random().toString(36).substring(2, 5)}`;

  const { data, error } = await supabase
    .from("players")
    .insert({
      name: botName,
      game_id: gameId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating bot player:", error);
    return null;
  }

  return data.id;
};

export const submitBotDrawing = async (gameId: string, botPlayerId: string) => {
  try {
    // Fetch game data
    const { data: gameData, error: gameError } = await supabase
      .from("games")
      .select(
        `
        current_player_index,
        players:players(id)
      `,
      )
      .eq("id", gameId)
      .single();

    if (gameError) throw gameError;

    // Check if it's the bot's turn
    const currentPlayerId = gameData.players[gameData.current_player_index].id;
    if (currentPlayerId !== botPlayerId) {
      console.log("Not bot's turn yet");
      return;
    }

    // Generate a simple drawing
    const botDrawing =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

    // Submit the drawing
    const { error: drawingError } = await supabase.from("drawings").insert({
      game_id: gameId,
      player_id: botPlayerId,
      image_data: botDrawing,
    });

    if (drawingError) throw drawingError;

    // Update the game state
    const { error: updateError } = await supabase
      .from("games")
      .update({
        current_player_index:
          (gameData.current_player_index + 1) % gameData.players.length,
      })
      .eq("id", gameId);

    if (updateError) throw updateError;

    console.log("Bot drawing submitted successfully");
  } catch (error) {
    console.error("Error in submitBotDrawing:", error);
  }
};

const botMessages = [
  "I'm drawing as fast as I can!",
  "This is a tough one...",
  "I hope you can guess what this is!",
  "Art is my passion!",
  "Is this good enough?",
  "I'm not sure what I'm drawing...",
  "This game is fun!",
  "I'm trying my best!",
];

export const sendBotMessage = async (
  gameId: string,
  botId: string,
  botName: string,
) => {
  const randomMessage =
    botMessages[Math.floor(Math.random() * botMessages.length)];
  try {
    await supabase.from("chat_messages").insert({
      game_id: gameId,
      player_id: botId,
      player_name: botName,
      message: randomMessage,
    });
  } catch (error) {
    console.error("Error sending bot message:", error);
  }
};
