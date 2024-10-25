"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@radix-ui/themes";

const ToggleTheme = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    setIsDark(theme === "dark");
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
    document.documentElement.style.colorScheme = newTheme;
    window.dispatchEvent(new Event("storage")); // Trigger the storage event
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      style={{
        position: "fixed",
        bottom: "1rem",
        left: "1rem",
        zIndex: 50,
        padding: "0.5rem",
      }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
};

export default ToggleTheme;
