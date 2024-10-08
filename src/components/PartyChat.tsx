"use client";

import Image from "next/image";
import { Text, TextField, Button } from "@radix-ui/themes";
import HotdogIcon from "../app/icons/hotdog-sharp-duotone-solid.svg";
import PlayIcon from "../app/icons/circle-play-sharp-duotone-solid.svg";
import HandshakeIcon from "../app/icons/handshake-sharp-duotone-solid.svg";
import PartyIcon from "../app/icons/face-party-sharp-duotone-solid.svg";

export default function PartyChat() {
  return (
    <div className="md:w-6/24 bg-background p-4">
      <Text size="5" weight="bold" mb="4">
        Hot Damn!
      </Text>
      <div className="bg-accent-9 mb-4 flex justify-between rounded-full p-2">
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
        <Image
          src={PartyIcon}
          alt="Party mode"
          width={18}
          height={18}
          className="h-5 w-5"
        />
      </div>
      <div className="bg-gray-3 mb-4 h-96 overflow-y-auto rounded-lg p-4">
        {/* Chat messages would go here */}
      </div>
      <div className="relative">
        <TextField.Root placeholder="Type a message..."></TextField.Root>
        <Button
          variant="ghost"
          className="absolute right-2 top-1/2 -translate-y-1/2 transform"
        >
          <Image
            src={PlayIcon}
            alt="Send"
            width={18}
            height={18}
            className="h-5 w-5"
          />
        </Button>
      </div>
    </div>
  );
}
