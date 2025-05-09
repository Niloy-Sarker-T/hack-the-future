import React, { useMemo } from "react";

function Pattern() {
  const circles = useMemo(
    () =>
      Array.from({ length: 20 }).map(() => ({
        width: Math.random() * 10 + 2,
        height: Math.random() * 10 + 2,
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.1,
      })),
    []
  );

  const lines = useMemo(
    () =>
      Array.from({ length: 15 }).map(() => ({
        x1: Math.random() * 100,
        y1: Math.random() * 100,
        x2: Math.random() * 100,
        y2: Math.random() * 100,
        opacity: Math.random() * 0.3 + 0.1,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-full">
        {circles.map((circle, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#14B8A6]"
            style={{
              width: `${circle.width}px`,
              height: `${circle.height}px`,
              top: `${circle.top}%`,
              left: `${circle.left}%`,
              opacity: circle.opacity,
            }}
          />
        ))}
      </div>
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {lines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#14B8A6"
            strokeWidth="0.1"
            opacity={line.opacity}
          />
        ))}
      </svg>
    </div>
  );
}

export default Pattern;
