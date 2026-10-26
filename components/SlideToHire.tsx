"use client";

import { useRef, useState } from "react";

// Original slide-to-confirm control, inspired in pattern only by the
// slide-to-book idea seen on cuedesign.space — no code, copy, or
// assets taken from that site. Dragging the thumb all the way to
// the end is a deliberate action: it opens the same mailto link
// the "Write an email" button uses. The normal buttons stay in
// place, so keyboard and touch users who prefer a plain click
// never have to use the slider.

const EMAIL = "nexusfx.media@gmail.com";

export default function SlideToHire() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0..1
  const [dragging, setDragging] = useState(false);
  const [done, setDone] = useState(false);

  const complete = () => {
    setDone(true);
    setProgress(1);
    window.location.href = `mailto:${EMAIL}`;
    setTimeout(() => {
      setDone(false);
      setProgress(0);
    }, 1500);
  };

  const updateFromClientX = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const thumb = 56; // thumb width in px, matches the class below
    const max = Math.max(rect.width - thumb, 1);
    const x = Math.min(Math.max(clientX - rect.left - thumb / 2, 0), max);
    setProgress(x / max);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };

  const onPointerUp = () => {
    setDragging(false);
    if (progress >= 0.9) {
      complete();
    } else {
      setProgress(0);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setProgress((p) => Math.min(p + 0.1, 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setProgress((p) => Math.max(p - 0.1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setProgress(0);
    } else if (e.key === "End" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      complete();
    }
  };

  return (
    <div className="relative">
      <p className="mb-2 font-mono text-xs text-white/60">
        {done ? "Opening email…" : "Slide to hire — drag the block to the end"}
      </p>
      <div
        ref={trackRef}
        className="relative h-14 w-full overflow-hidden bg-zinc-900 ring-1 ring-zinc-700"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          setDragging(false);
          setProgress(0);
        }}
      >
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 bg-lime-400"
          style={{ width: `${progress * 100}%` }}
          aria-hidden="true"
        />
        {/* Label, fades out as the fill covers it */}
        <span
          className="absolute inset-0 grid place-items-center font-pixelify text-sm text-white/70"
          aria-hidden="true"
        >
          {done ? "Opening email…" : "Slide to hire →"}
        </span>
        {/* Thumb */}
        <div
          role="slider"
          aria-label="Slide to hire NexusFX"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="absolute top-0 grid h-14 w-14 cursor-grab place-items-center bg-black text-xl text-lime-400 ring-1 ring-lime-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 active:cursor-grabbing motion-reduce:transition-none"
          style={{
            left: `calc(${progress * 100}% - ${progress * 56}px)`,
            transition: dragging ? "none" : "left 0.3s ease",
          }}
        >
          →
        </div>
      </div>
    </div>
  );
}
