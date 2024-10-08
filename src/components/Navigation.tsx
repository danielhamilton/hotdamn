"use client";

import Image from "next/image";
import { Box } from "@radix-ui/themes";
import HotdogIcon from "../app/icons/hotdog-sharp-duotone-solid.svg";
import PlayIcon from "../app/icons/circle-play-sharp-duotone-solid.svg";
import HandshakeIcon from "../app/icons/handshake-sharp-duotone-solid.svg";
import MoonIcon from "../app/icons/moon-stars-sharp-duotone-solid.svg";
import SunIcon from "../app/icons/sun-sharp-duotone-solid.svg";
import PartyIcon from "../app/icons/face-party-sharp-duotone-solid.svg";

type NavigationProps = {
  mode: "light" | "dark" | "party";
  toggleMode: () => void;
};

export default function Navigation({ mode, toggleMode }: NavigationProps) {
  const getModeIcon = () => {
    switch (mode) {
      case "light":
        return (
          <Image
            src={SunIcon}
            alt="Light mode"
            width={18}
            height={18}
            className="h-5 w-5"
          />
        );
      case "dark":
        return (
          <Image
            src={MoonIcon}
            alt="Dark mode"
            width={18}
            height={18}
            className="h-5 w-5"
          />
        );
      case "party":
        return (
          <Image
            src={PartyIcon}
            alt="Party mode"
            width={18}
            height={18}
            className="h-5 w-5"
          />
        );
    }
  };

  return (
    <Box asChild>
      <nav className="fixed bottom-4 left-4 right-4 md:static md:m-4 md:h-[calc(100vh-2rem)]">
        <Box
          className="flex items-center justify-between space-y-0 rounded-full p-4 md:h-full md:flex-col md:justify-between md:p-6"
          p="4"
          style={{ backgroundColor: "var(--accent-9)" }}
        >
          <div className="flex w-full items-center justify-between space-x-4 md:flex-col md:items-center md:justify-start md:space-x-0 md:space-y-8">
            <Image
              src={HotdogIcon}
              alt="Hotdog"
              width={18}
              height={18}
              className="h-5 w-5"
            />
            <Image
              src={PlayIcon}
              alt="Play"
              width={18}
              height={18}
              className="h-5 w-5"
            />
            <Image
              src={HandshakeIcon}
              alt="Handshake"
              width={18}
              height={18}
              className="h-5 w-5"
            />
          </div>
          <button onClick={toggleMode} className="mt-auto">
            {getModeIcon()}
          </button>
        </Box>
      </nav>
    </Box>
  );
}
