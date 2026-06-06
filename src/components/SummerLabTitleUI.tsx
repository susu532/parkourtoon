import React from "react";

export function SummerLabTitleUI() {
  return (
    <div className="absolute top-[2%] left-1/2 -translate-x-1/2 pointer-events-none z-10 w-full flex justify-center items-center pl-safe pr-safe">
      <h1
        className="font-black text-center uppercase flex items-center justify-center gap-1.5 sm:gap-2.5 flex-wrap whitespace-nowrap"
        style={{
          fontFamily: "'Pixelify Sans', sans-serif",
          fontSize: "clamp(1.5rem, 5vw, 3rem)",
          margin: 0,
        }}
      >
        <span
          style={{
            background: "linear-gradient(to bottom, #ff99cc, #ff1493)", // Pink gradient for ParkourToon
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            WebkitTextStroke: "1px rgba(60,0,20,0.8)",
            letterSpacing: "0.12em",
            filter: `
              drop-shadow(1px 1px 0px #800040) 
              drop-shadow(1px 2px 0px #4d0026) 
              drop-shadow(3px 4px 8px rgba(0,0,0,0.6))
            `,
          }}
        >
          ParkourToon
        </span>
      </h1>
    </div>
  );
}
