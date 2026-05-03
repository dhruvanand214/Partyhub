"use client";

import { useEffect, useState } from "react";

const COLORS = [
  "#FF6B35", "#FF2D78", "#7B2FFF", "#F7B731",
  "#00C48C", "#2F80FF", "#FF6B9D", "#FFC107",
];

interface Piece {
  id: number;
  color: string;
  left: string;
  delay: string;
  duration: string;
  size: number;
  rotate: number;
}

export default function Confetti({ count = 30 }: { count?: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    const arr: Piece[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
      duration: `${3 + Math.random() * 4}s`,
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
    }));
    setPieces(arr);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute opacity-80"
          style={{
            left: p.left,
            top: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            transform: `rotate(${p.rotate}deg)`,
            animation: `confettiFall ${p.duration} ${p.delay} linear infinite`,
          }}
        />
      ))}
    </div>
  );
}