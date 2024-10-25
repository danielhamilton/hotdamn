import React from "react";
import { Text, Flex } from "@radix-ui/themes";
import { GradientText } from "./GradientText";

interface PoemProps {
  title: string;
  titleGradient: string;
  titleFont: string;
  contentFont: string;
  verses: string[];
}

export const Poem: React.FC<PoemProps> = ({
  title,
  titleGradient,
  titleFont,
  contentFont,
  verses,
}) => {
  return (
    <Flex direction="column" gap="3">
      <Text size="3" weight="medium" style={{ fontFamily: titleFont }}>
        <GradientText gradient={titleGradient}>{title}</GradientText>
      </Text>
      {verses.map((verse, index) => (
        <Text
          key={index}
          size="2"
          style={{ fontFamily: contentFont }}
          color="gray"
        >
          {verse}
        </Text>
      ))}
    </Flex>
  );
};
