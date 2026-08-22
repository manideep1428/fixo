"use client";

import React, { useEffect, useState } from "react";

export default function AxionHeroShader() {
  const [ShaderComponents, setShaderComponents] = useState<any>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;
    import("shaders/react")
      .then((mod) => {
        if (mounted) {
          setShaderComponents(mod);
        }
      })
      .catch((err) => {
        console.warn("Failed to load shaders/react:", err);
        if (mounted) setHasError(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (hasError || !ShaderComponents) {
    return (
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-50 bg-gradient-to-br from-[#f7fee7] via-[#ecfccb] to-[#d9f99d]"
        aria-hidden="true"
      />
    );
  }

  const { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } = ShaderComponents;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      <Shader className="w-full h-full">
        <Swirl colorA="#ffffff" colorB="#f7fee7" detail={1.7} />
        <ChromaFlow
          baseColor="#ffffff"
          downColor="#84cc16"
          leftColor="#a3e635"
          rightColor="#65a30d"
          upColor="#4d7c0f"
          momentum={13}
          radius={3.5}
        />
        <FlutedGlass
          aberration={0.61}
          angle={31}
          frequency={8}
          highlight={0.12}
          highlightSoftness={0}
          lightAngle={-90}
          refraction={4}
          shape="rounded"
          softness={1}
          speed={0.15}
        />
        <FilmGrain strength={0.05} />
      </Shader>
    </div>
  );
}
