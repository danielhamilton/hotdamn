"use client";
import React, { useRef, useEffect } from "react";
import { Box, Text, Button } from "@radix-ui/themes";

interface DrawingCanvasProps {
  prompt: string;
  onSubmit: (imageData: string) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ prompt, onSubmit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Initialize canvas
  }, []);

  const handleSubmit = () => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL();
      onSubmit(imageData);
    }
  };

  return (
    <Box>
      <Text size="3">Please draw: {prompt}</Text>
      <canvas ref={canvasRef} width={300} height={300} />
      <Button onClick={handleSubmit}>Done</Button>
    </Box>
  );
};

export default DrawingCanvas;
