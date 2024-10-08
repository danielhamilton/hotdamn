"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Navigation from "./Navigation";
import PartyChat from "./PartyChat";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mode, setMode] = useState<"light" | "dark" | "party">("light");
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(mode === "party" ? "party" : mode);
  }, [mode, setTheme]);

  const toggleMode = () => {
    setMode((currentMode) => {
      switch (currentMode) {
        case "light":
          return "dark";
        case "dark":
          return "party";
        case "party":
          return "light";
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navigation mode={mode} toggleMode={toggleMode} />
      <main className="md:w-16/24 flex-grow p-8">
        <h1 className="mb-8 text-6xl font-bold">Hot Damn!</h1>
        {children}
      </main>
      <PartyChat />
    </div>
  );
}
