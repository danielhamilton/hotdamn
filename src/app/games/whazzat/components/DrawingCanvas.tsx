import React, { useRef, useState, useEffect } from "react";
import { Box, Slider, Flex, Button, Text } from "@radix-ui/themes";

interface DrawingCanvasProps {
  onSubmit: (imageData: string) => void;
  timeLeft: number;
}

const colors = [
  "#000000",
  "#FFFFFF",
  "#808080",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#00FFFF",
  "#FF00FF",
  "#FFA500",
];

export default function DrawingCanvas({
  onSubmit,
  timeLeft,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.lineJoin = "round";
        setCtx(context);
        saveCanvasState();
      }
    }
  }, []);

  const saveCanvasState = () => {
    if (ctx && canvasRef.current) {
      const imageData = ctx.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
      setUndoStack((prevStack) => [...prevStack, imageData]);
      setRedoStack([]);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (ctx) {
      ctx.closePath();
      setIsDrawing(false);
      saveCanvasState();
    }
  };

  const clearCanvas = () => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      saveCanvasState();
    }
  };

  const undo = () => {
    if (undoStack.length > 1 && ctx && canvasRef.current) {
      const currentState = undoStack.pop();
      if (currentState) {
        setRedoStack((prevStack) => [...prevStack, currentState]);
        const previousState = undoStack[undoStack.length - 1];
        ctx.putImageData(previousState, 0, 0);
        setUndoStack([...undoStack]);
      }
    }
  };

  const redo = () => {
    if (redoStack.length > 0 && ctx && canvasRef.current) {
      const nextState = redoStack.pop();
      if (nextState) {
        ctx.putImageData(nextState, 0, 0);
        setUndoStack((prevStack) => [...prevStack, nextState]);
        setRedoStack([...redoStack]);
      }
    }
  };

  const handleSubmit = () => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL();
      onSubmit(imageData); // Call the onSubmit prop function
    }
  };

  return (
    <Box>
      <Text size="3" mb="2">
        Time left: {timeLeft} seconds
      </Text>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        style={{ border: "1px solid #000" }}
      />
      <Flex gap="2" mt="2">
        {colors.map((c) => (
          <Box
            key={c}
            style={{
              width: 20,
              height: 20,
              backgroundColor: c,
              cursor: "pointer",
              border: c === color ? "2px solid #000" : "none",
            }}
            onClick={() => setColor(c)}
          />
        ))}
      </Flex>
      <Flex direction="column" gap="2" mt="2">
        <Text size="2">Brush size: {brushSize}</Text>
        <Slider
          min={1}
          max={20}
          step={1}
          value={[brushSize]}
          onValueChange={(value) => setBrushSize(value[0])}
        />
        <Flex gap="2">
          <Button onClick={undo} disabled={undoStack.length <= 1}>
            Undo
          </Button>
          <Button onClick={redo} disabled={redoStack.length === 0}>
            Redo
          </Button>
          <Button onClick={clearCanvas}>Clear</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </Flex>
      </Flex>
    </Box>
  );
}
