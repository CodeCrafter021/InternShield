import React from "react";

/**
 * Global SVG Displacement & Refraction Shaders
 * Provides reusable real-time liquid distortion, gooey metaball filters,
 * and chromatic aberration displacement maps for the Apple Liquid Glass system.
 */
export default function LiquidFilters() {
  return (
    <svg
      id="liquid-filters-svg"
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        pointerEvents: "none",
        visibility: "hidden",
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Subtle Organic Liquid Refraction Filter */}
        <filter id="liquid-refraction" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.015"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="7"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feBlend in="SourceGraphic" in2="displaced" mode="normal" />
        </filter>

        {/* Viscous Gelatinous Gooey / Metaball Filter */}
        <filter id="liquid-gooey">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="gooey"
          />
          <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
        </filter>

        {/* Chromatic Edge Aberration Filter */}
        <filter id="liquid-chromatic">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="red"
          />
          <feOffset in="red" dx="1.5" dy="0" result="red-offset" />
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="green"
          />
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="blue"
          />
          <feOffset in="blue" dx="-1.5" dy="0" result="blue-offset" />
          <feBlend in="red-offset" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blue-offset" mode="screen" />
        </filter>
      </defs>
    </svg>
  );
}
