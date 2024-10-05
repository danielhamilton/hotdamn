import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "@radix-ui/themes/styles.css";
import "./globals.css";
import { ThemeProvider } from "./ThemeContext";
import { Theme } from "@radix-ui/themes";
import { ThemeWrapper } from "./components/ThemeWrapper";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "HotDamn!Fun",
  description: "An exciting multiplayer drawing and guessing game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Theme appearance="dark" accentColor="blue">
            {children}
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
