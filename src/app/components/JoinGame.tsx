import { useState } from "react";

interface JoinGameProps {
  onJoin: (name: string, code: string) => void;
}

export default function JoinGame({ onJoin }: JoinGameProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onJoin(name, code);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        required
      />
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter game code"
        required
      />
      <button type="submit">Join Game</button>
    </form>
  );
}
