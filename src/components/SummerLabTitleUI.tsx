import React from 'react';

export function SummerLabTitleUI() {
  return (
    <div className="absolute top-[2%] left-1/2 -translate-x-1/2 pointer-events-none z-10 w-full flex flex-col justify-center items-center safe-pl safe-pr origin-top [@media(orientation:landscape)_and_(max-height:500px)]:scale-[0.6] [@media(orientation:landscape)_and_(max-height:500px)]:-mt-2">
      <h1
        className="font-black text-center uppercase flex items-center justify-center gap-1.5 sm:gap-2.5 flex-wrap whitespace-nowrap"
        style={{
          fontFamily: "'Pixelify Sans', sans-serif",
          fontSize: "clamp(1.5rem, 5vw, 3rem)",
          margin: 0,
        }}
      >
        <span style={{ letterSpacing: "0.12em" }}>
          <span
            style={{
              color: "#f472b6",
              WebkitTextStroke: "1px rgba(50,0,60,0.8)",
              filter: "drop-shadow(1px 1px 0px #581c87) drop-shadow(1px 2px 0px #3b0764) drop-shadow(3px 4px 8px rgba(0,0,0,0.6))",
            }}
          >
            Parkourtoon
          </span>
        </span>
      </h1>
    </div>
  );
}
