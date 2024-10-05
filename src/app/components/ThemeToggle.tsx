import React from "react";
import { Button } from "@radix-ui/themes";
import { useTheme } from "../ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme}>{theme === "light" ? "🌙" : "☀️"}</Button>
  );
};

export default ThemeToggle;
