import React from 'react';
import { Box, Text, Button, Flex } from '@radix-ui/themes';

const categories = {
  common: ['Cat', 'Dog', 'House', 'Tree'],
  phrases: ['Break a leg', 'It's raining cats and dogs'],
  movies: ['Star Wars', 'The Godfather'],
  songs: ['Bohemian Rhapsody', 'Imagine'],
  nsfw: ['Adult content 1', 'Adult content 2'],
  custom: [] // This can be populated by user input
};

interface PromptLibraryProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectPrompt: (prompt: string) => void;
}

export default function PromptLibrary({ selectedCategory, onSelectCategory, onSelectPrompt }: PromptLibraryProps) {
  return (
    <Box>
      <Flex gap="2" mb="2">
        {Object.keys(categories).map(category => (
          <Button 
            key={category} 
            onClick={() => onSelectCategory(category)}
            variant={selectedCategory === category ? 'solid' : 'outline'}
          >
            {category}
          </Button>
        ))}
      </Flex>
      <Box>
        {categories[selectedCategory as keyof typeof categories].map(prompt => (
          <Text 
            key={prompt} 
            onClick={() => onSelectPrompt(prompt)}
            style={{ cursor: 'pointer', padding: '4px' }}
          >
            {prompt}
          </Text>
        ))}
      </Box>
    </Box>
  );
}
