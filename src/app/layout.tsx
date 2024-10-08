import type { Metadata } from "next";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme, ThemePanel } from "@radix-ui/themes";
import ClientLayout from "../components/ClientLayout";

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
          radius="full"
          scaling="100%"
        >
          <ClientLayout>{children}</ClientLayout>
          <ThemePanel />
        </Theme>
      </body>
    </html>
  );
}
