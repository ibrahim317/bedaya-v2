"use client";
import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="cube-loader -mt-40">
        <div className="cube-top"></div>
        <div className="cube-wrapper">
          <span
            style={{ "--i": 0 } as React.CSSProperties}
            className="cube-span"
          ></span>
          <span
            style={{ "--i": 1 } as React.CSSProperties}
            className="cube-span"
          ></span>
          <span
            style={{ "--i": 2 } as React.CSSProperties}
            className="cube-span"
          ></span>
          <span
            style={{ "--i": 3 } as React.CSSProperties}
            className="cube-span"
          ></span>
        </div>
        <style jsx>{`
          .cube-loader {
            position: relative;
            width: 75px;
            height: 75px;
            transform-style: preserve-3d;
            transform: rotateX(-30deg);
            animation: animate 4s linear infinite;
          }

          @keyframes animate {
            0% {
              transform: rotateX(-30deg) rotateY(0);
            }
            100% {
              transform: rotateX(-30deg) rotateY(360deg);
            }
          }

          .cube-loader .cube-wrapper {
            position: absolute;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
          }

          .cube-loader .cube-wrapper .cube-span {
            position: absolute;
            width: 100%;
            height: 100%;
            transform: rotateY(calc(90deg * var(--i))) translateZ(37.5px);
            background: linear-gradient(
              to bottom,
              hsl(120, 0%, 100%) 0%,
              hsl(120, 0%, 100%) 5.5%,
              hsl(120, 0%, 100%) 12.1%,
              hsl(120, 0%, 100%) 19.6%,
              hsl(120, 0%, 100%) 27.9%,
              hsl(120, 0%, 100%) 36.6%,
              hsl(120, 0%, 100%) 45.6%,
              hsl(120, 0%, 100%) 54.6%,
              hsl(120, 0%, 100%) 63.4%,
              hsl(120, 0%, 100%) 71.7%,
              hsl(120, 0%, 100%) 79.4%,
              hsl(120, 0%, 100%) 86.2%,
              hsl(120, 0%, 100%) 91.9%,
              hsl(120, 0%, 100%) 96.3%,
              hsl(120, 0%, 100%) 99%,
              hsl(120, 0%, 100%) 100%
            );
          }

          .cube-top {
            position: absolute;
            width: 75px;
            height: 75px;
            background: hsl(120, 0%, 100%) 0%;
            transform: rotateX(90deg) translateZ(37.5px);
            transform-style: preserve-3d;
          }

          .cube-top::before {
            content: "";
            position: absolute;
            width: 75px;
            height: 75px;
            background: hsl(120, 42.28%, 40.7%) 19.6%;
            transform: translateZ(-90px);
            filter: blur(10px);
          }
        `}</style>
      </div>
    </div>
  );
};

export default Loading;