// File: /src/app/page.tsx

import dynamic from "next/dynamic";

const Game = dynamic(() => import("./components/Game"), { ssr: false });

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <Game />
    </div>
  );
}
