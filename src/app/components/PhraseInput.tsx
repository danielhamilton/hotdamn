import { useState } from "react";

interface PhraseInputProps {
  onSubmit: (phrase: string) => void;
}

export default function PhraseInput({ onSubmit }: PhraseInputProps) {
  const [phrase, setPhrase] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(phrase);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={phrase}
        onChange={(e) => setPhrase(e.target.value)}
        placeholder="Enter a phrase"
        required
      />
      <button type="submit">Submit Phrase</button>
    </form>
  );
}
