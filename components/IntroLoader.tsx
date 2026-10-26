"use client";

import { useEffect, useState } from "react";

// Intro loader for v2: a black screen with the NexusFX logo
// flipping (rotateY 0 -> 360deg over 1.4s, no zoom), then the
// black screen itself slides up (bottom to top, 0.7s) and
// unmounts, revealing the real website, which was already
// rendered underneath it. Reduced-motion users skip it entirely.
export default function IntroLoader() {
  const [sliding, setSliding] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const slideTimer = window.setTimeout(() => setSliding(true), 1400);
    // Restore scroll here, not only in cleanup: this component
    // stays mounted and just returns null when done, so cleanup
    // (which runs only on unmount) never fired — leaving
    // body overflow hidden forever and breaking all scrolling.
    const doneTimer = window.setTimeout(() => {
      document.body.style.overflow = previousOverflow;
      setDone(true);
    }, 2200);
    return () => {
      window.clearTimeout(slideTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-transform duration-700 ease-in-out ${
        sliding ? "pointer-events-none -translate-y-full" : "translate-y-0"
      }`}
      style={{ perspective: "1000px" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="" className="v2-intro-flip h-44 w-44 object-contain" />
    </div>
  );
}
