import type { Metadata } from "next";

import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme, ThemePanel } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "Hot Damn!",
  description: "Hot Damn! Games for teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Theme
          accentColor="tomato"
          grayColor="sand"
          radius="small"
          scaling="100%"
        >
          {children}
          <ThemePanel />
        </Theme>
      </body>
    </html>
  );
}
