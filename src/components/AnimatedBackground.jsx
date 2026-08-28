import React from "react";

// Seamless dark cyber background: aurora blobs + grid + floating soft-focus
// 3D rounded cubes with purple/cyan neon ambient glow.
// Pure CSS animation — cheap to render, no canvas needed.
export default function AnimatedBackground() {
  return (
    <div className="aurora-bg" aria-hidden="true">
      {/* Aurora color blobs */}
      <div className="aurora-blob one" />
      <div className="aurora-blob two" />
      <div className="aurora-blob three" />
      <div className="aurora-blob four" />

      {/* Moving grid */}
      <div className="grid-overlay" />

      {/* Floating 3D cubes — soft focus, ambient glow */}
      <div className="float-cube float-cube--1">
        <div className="float-cube__face float-cube__face--top" />
        <div className="float-cube__face float-cube__face--front" />
        <div className="float-cube__face float-cube__face--right" />
      </div>
      <div className="float-cube float-cube--2">
        <div className="float-cube__face float-cube__face--top" />
        <div className="float-cube__face float-cube__face--front" />
        <div className="float-cube__face float-cube__face--right" />
      </div>
      <div className="float-cube float-cube--3">
        <div className="float-cube__face float-cube__face--top" />
        <div className="float-cube__face float-cube__face--front" />
        <div className="float-cube__face float-cube__face--right" />
      </div>
      <div className="float-cube float-cube--4">
        <div className="float-cube__face float-cube__face--top" />
        <div className="float-cube__face float-cube__face--front" />
        <div className="float-cube__face float-cube__face--right" />
      </div>
      <div className="float-cube float-cube--5">
        <div className="float-cube__face float-cube__face--top" />
        <div className="float-cube__face float-cube__face--front" />
        <div className="float-cube__face float-cube__face--right" />
      </div>
      <div className="float-cube float-cube--6">
        <div className="float-cube__face float-cube__face--top" />
        <div className="float-cube__face float-cube__face--front" />
        <div className="float-cube__face float-cube__face--right" />
      </div>

      {/* Vignette overlay */}
      <div className="bg-vignette" />
    </div>
  );
}
