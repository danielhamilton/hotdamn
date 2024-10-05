import axios from "axios";

const API_BASE_URL = "http://localhost:3001"; // Ensure this matches your server port

export const joinParty = async (partyCode: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/join-party`, {
      partyCode,
    });
    return response.data;
  } catch (error) {
    console.error("Error joining party:", error);
    throw error;
  }
};

export const startParty = async () => {
  console.log("Calling startParty API"); // Debug log
  try {
    const response = await axios.post(`${API_BASE_URL}/start-party`);
    console.log("API response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Error in startParty API call:", error);
    throw error;
  }
};
