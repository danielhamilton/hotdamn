import { useState } from "react";

interface GuessingPhaseProps {
  onSubmit: (guess: string) => void;
}

export default function GuessingPhase({ onSubmit }: GuessingPhaseProps) {
  const [guess, setGuess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(guess);
  };

  return (
    <div>
      <h3>Guess the Drawing</h3>
      {/* Display the drawing here */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter your guess"
          required
        />
        <button type="submit">Submit Guess</button>
      </form>
    </div>
  );
}
