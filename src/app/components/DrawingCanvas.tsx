"use client";
import React, { useRef, useEffect, useState } from "react";
import { Box, Button, Flex } from "@radix-ui/themes";

interface DrawingCanvasProps {
  prompt: string;
  onSubmit: (drawingData: string) => void;
}

export default function DrawingCanvas({
  prompt,
  onSubmit,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      // Set up canvas drawing here
    }
  }, []);

  const handleSubmit = () => {
    if (canvasRef.current) {
      const drawingData = canvasRef.current.toDataURL();
      onSubmit(drawingData);
    }
  };

  return (
    <div>
      <h3>Draw: {prompt}</h3>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: "1px solid black" }}
      />
      <button onClick={handleSubmit}>Submit Drawing</button>
    </div>
  );
}
