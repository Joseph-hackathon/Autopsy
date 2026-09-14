"use client";

import React, { useEffect, useRef, useState } from "react";

interface CanvasStatProps {
  value: string;
  label: string;
  width?: number;
  height?: number;
}

export default function CanvasStat({ value, label, width = 127, height = 97 }: CanvasStatProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let frameCount = 0;
    const maxFrames = 40; // scramble for a bit

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw a subtle grid background
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 20) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += 20) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      ctx.fillStyle = isHovered ? "#ffffff" : "#ececec";
      ctx.font = "bold 42px 'Teko', 'Share Tech Mono', monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      let displayValue = value;
      
      if (frameCount < maxFrames) {
        // Scramble effect
        displayValue = value
          .split("")
          .map((char) => {
            if (char === " " || char === "." || char === "%" || char === "$") return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        frameCount++;
        frameId = requestAnimationFrame(draw);
      } else {
        if (isHovered) {
          // slight glitch effect on hover
          if (Math.random() > 0.95) {
             ctx.fillStyle = "#00ff66";
             ctx.fillText(displayValue, 5 + Math.random()*2, height / 2 + Math.random()*2);
             ctx.fillStyle = "#ffffff";
          }
        }
      }

      ctx.fillText(displayValue, 5, height / 2);
    };

    draw();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [value, width, height, isHovered]);

  return (
    <div 
      className="stat flex flex-col lg:flex-1 lg:py-4 cursor-default group" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ minWidth: "178px" }}
    >
      <div style={{ width: `${width}px`, height: `${height}px`, position: "relative" }}>
        <canvas 
          ref={canvasRef} 
          width={width} 
          height={height} 
          className="absolute inset-0"
        />
      </div>
      <div className="font-blender text-xl uppercase transition-all duration-500 lg:text-sm text-[#888888] group-hover:text-[#ececec] mt-2 tracking-widest">
        {label}
      </div>
    </div>
  );
}
