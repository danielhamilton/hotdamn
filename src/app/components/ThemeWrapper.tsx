"use client";

import { Theme } from "@radix-ui/themes";
import { useTheme } from "../ThemeContext";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <Theme
      appearance={theme}
      grayColor="sand"
      accentColor="cyan"
      radius="large"
    >
      {children}
    </Theme>
  );
}
