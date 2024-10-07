import React, { useRef, useEffect } from "react";
import { Box } from "@radix-ui/themes";

interface DrawingAreaProps {
  onDraw: (imageData: string) => void;
}

const DrawingArea: React.FC<DrawingAreaProps> = ({ onDraw }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let isDrawing = false;

    const startDrawing = (e: MouseEvent) => {
      isDrawing = true;
      draw(e);
    };

    const stopDrawing = () => {
      isDrawing = false;
      context.beginPath();
      onDraw(canvas.toDataURL());
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;

      context.lineWidth = 2;
      context.lineCap = "round";
      context.strokeStyle = "#000000";

      context.lineTo(
        e.clientX - canvas.offsetLeft,
        e.clientY - canvas.offsetTop,
      );
      context.stroke();
      context.beginPath();
      context.moveTo(
        e.clientX - canvas.offsetLeft,
        e.clientY - canvas.offsetTop,
      );
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
    };
  }, [onDraw]);

  return (
    <Box>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{ border: "1px solid black" }}
      />
    </Box>
  );
};

export default DrawingArea;
