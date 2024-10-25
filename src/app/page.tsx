// File: /src/app/page.tsx
import localFont from "next/font/local";
import { Container, Heading, Flex } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { Poem } from "./components/Poem";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <Container size="3" py="9">
        <Heading size="3" mb="4" weight="medium">
          Poems
        </Heading>

        <Flex direction="column" gap="8">
          <Poem
            title="The Weight of Shadows"
            titleGradient="from-blue-400 via-blue-600 to-blue-800"
            titleFont="var(--font-geist-sans)"
            contentFont="var(--font-geist-sans)"
            verses={[
              "In the quiet hours where light abandons, a heavy breath settles over the world. Darkness isn't just absence; it's a presence, a thick and pulsing veil draped across all things familiar. The streets become long, silent caverns, and every echo sounds like a question. Beneath this cover, doubt settles, gentle yet profound, like silt on the riverbed. It's here that thoughts twist in shapes that daylight never sees, and the mind sinks, unmoored, into depths rarely visited.",
              "But as the night deepens, there's a subtle softening, a hidden rhythm under all that weight. Shadows, once solid, start to shift, becoming delicate wisps that drift at the edges. Soon, the faintest hint of dawn kisses the horizon, and in that kiss, darkness begins to unwind. The first light doesn't banish; it soothes, thinning shadows into specters and warming the earth awake. Slowly, life's familiar shapes return, and the weight lifts, like a gentle hand unclasping from a shoulder.",
            ]}
          />

          <Poem
            title="Glimmers in the Gloom"
            titleGradient="from-yellow-400 via-pink-500 to-gray-700"
            titleFont="var(--font-geist-mono)"
            contentFont="var(--font-geist-mono)"
            verses={[
              "In the heart of the night, a quiet settles over everything, dense and unmoving. Every sound, every shadow, feels larger, consuming more space, as if even the walls of the room lean in to listen. Darkness pulls life inward, drawing out the sorrows tucked neatly away, coaxing them into the open. There's a strange comfort here, an honesty in the quiet—pain acknowledged without distraction, truths whispered in darkness that the day can't bear to see.",
              "Yet, as the minutes stretch, something stirs, almost invisible, as if the air itself holds a memory of light. A small flicker, barely there, pulses at the edges of vision, fragile but undeniable. Slowly, like ink dispersing in water, faint colors bleed into view, and the world brightens in barely-there gradients. What was hidden, concealed, takes form in the gentle reveal of dawn, and the darkness doesn't disappear but fades into the background, leaving space for morning's light to speak.",
            ]}
          />
        </Flex>
      </Container>
    </div>
  );
}
