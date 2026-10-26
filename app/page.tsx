"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, Envelope, Instagram, Play } from "reicon-react";

import TargetCursor from "@/components/TargetCursor";

import IntroLoader from "@/components/IntroLoader";
import SlideToHire from "@/components/SlideToHire";

// NexusFX v2 — original homepage, inspired in general structure only by
// notenemyok.com (pill nav, full-height hero, clients panel, video grid,
// closing hire panel, and the card ideas: square client tiles with a
// featured tile + name pill, landscape video cards with a bottom-right
// play button). No text, images, videos, or code copied from that site;
// all copy below is written for NexusFX, and the animation / hover
// code here is original.
//
// Creators are now real (from v1, see CLIENTS). Video titles below
// are still fictional placeholders, NOT real NexusFX videos.
// Replace them with real ones before publishing.
// Real NexusFX creators, copied from v1 (components/about.tsx):
// logos are the channels' official YouTube avatars, copied from
// v1 public/creators/ into v2 public/creators/. No longer fictional.
// Subscriber counts + "who" lines read from each channel's official
// YouTube page on 2026-10-25. Counts drift as channels grow, so
// refresh them from the channel pages if they start looking stale.
const CLIENTS = [
  { name: "GamerFleet", logo: "/creators/gamerfleet.jpg", url: "https://www.youtube.com/@GamerFleet", subs: "6.05M subscribers", desc: "Indian gaming creator — Minecraft, Lilyville series" },
  { name: "I. M. Bixu", logo: "/creators/imbixu.jpg", url: "https://www.youtube.com/@imbixu", subs: "4.46M subscribers", desc: "Gaming creator — horror & gameplay, “To Make You Smile!”" },
  { name: "BeckBros", logo: "/creators/beckbros.jpg", url: "https://www.youtube.com/@beckbros", subs: "698K subscribers", desc: "IRL channel — funny videos & challenges with friends" },
  { name: "BeckBroBlox", logo: "/creators/beckbroblox.jpg", url: "https://www.youtube.com/@BeckBroBlox", subs: "158K subscribers", desc: "Roblox gameplay" },
  { name: "SarahGrace", logo: "/creators/sarahgrace.jpg", url: "https://www.youtube.com/@TheSarahGrace", subs: "3.76M subscribers", desc: "Tech, unboxing & fun — iPhone / Apple" },
  { name: "Ayush Bhandari", logo: "/creators/ayushbhandari.jpg", url: "https://www.youtube.com/@AyushBhandari", subs: "6.74M subscribers", desc: "Experience & challenge videos" },
] as const;

// Showcase videos copied from v1 (components/showcase.tsx):
// placeholder picks for now, one per creator, verified in v1 via
// YouTube oEmbed. Replace these IDs later with real portfolio pieces.
const VIDEOS = [
  { id: "voAnIhI5PF8", title: "I MET THE PRIME MINISTER OF INDIA", creator: "GamerFleet", creatorUrl: "https://www.youtube.com/@GamerFleet", creatorLogo: "/creators/gamerfleet.jpg" },
  { id: "H5fyiYtyLjw", title: "Finding EVERY ANOMALY in SCHOOL!", creator: "I. M. Bixu", creatorUrl: "https://www.youtube.com/@imbixu", creatorLogo: "/creators/imbixu.jpg" },
  { id: "zbM-A_VKd58", title: "BeckBro's Cereal Tier List", creator: "BeckBros", creatorUrl: "https://www.youtube.com/@beckbros", creatorLogo: "/creators/beckbros.jpg" },
  { id: "2JHbnL5rj6c", title: "BeckBros Play Heave Ho 2", creator: "BeckBroBlox", creatorUrl: "https://www.youtube.com/@BeckBroBlox", creatorLogo: "/creators/beckbroblox.jpg" },
  { id: "Jaj75z2hGwo", title: "I 3D Printed a FOLDABLE iPhone...", creator: "SarahGrace", creatorUrl: "https://www.youtube.com/@TheSarahGrace", creatorLogo: "/creators/sarahgrace.jpg" },
  { id: "HsMemCsMGyc", title: "I Tried Every Celebrity Experience!", creator: "Ayush Bhandari", creatorUrl: "https://www.youtube.com/@AyushBhandari", creatorLogo: "/creators/ayushbhandari.jpg" },
] as const;


// transitions-dev text morph (33-text-morph.md, JS orchestration
// adapted to React + TypeScript). The label span in JSX keeps a
// constant "Copy address" child, so React never overwrites the
// morph DOM; the effect below drives the text instead.
type MorphEl = HTMLElement & { _morphTimer?: ReturnType<typeof setTimeout> };
function morphText(el: MorphEl, next: string) {
  const prev = el.dataset.text ?? el.textContent ?? "";
  if (prev === next) return;
  el.dataset.text = next;
  if (el._morphTimer) clearTimeout(el._morphTimer);
  const root = document.documentElement;
  const ms = (name: string) =>
    parseFloat(getComputedStyle(root).getPropertyValue(name)) || 0;

  let a = 0;
  while (a < prev.length && a < next.length && prev[a] === next[a]) a++;
  let b = 0;
  while (
    b < prev.length - a &&
    b < next.length - a &&
    prev[prev.length - 1 - b] === next[next.length - 1 - b]
  )
    b++;

  const swap = document.createElement("span");
  swap.className = "t-morph-swap";
  const out = document.createElement("span");
  out.className = "t-morph-old";
  out.setAttribute("aria-hidden", "true");
  out.textContent = prev.slice(a, prev.length - b);
  const inn = document.createElement("span");
  inn.className = "t-morph-new";
  inn.textContent = next.slice(a, next.length - b);
  swap.append(out, inn);

  el.textContent = "";
  el.append(next.slice(0, a), swap, next.slice(next.length - b));

  swap.style.width = out.getBoundingClientRect().width + "px";
  void swap.offsetWidth; // force reflow so the width transitions
  swap.classList.add("is-morphing");
  swap.style.width = inn.getBoundingClientRect().width + "px";

  el._morphTimer = setTimeout(() => {
    el.textContent = next;
  }, Math.max(ms("--text-morph-dur"), ms("--text-morph-resize-dur")) + 40);
}

export default function Home() {
  // Featured client tile: NO tile is featured at rest, so all six
  // tiles sit in exactly the same state. Hover (or keyboard focus)
  // features a tile, and leaving it clears the feature again.
  const [featuredClient, setFeaturedClient] = useState<number | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const copyLabelRef = useRef<HTMLSpanElement>(null);

  // Drive the Copy button label through the text morph: on mount
  // this is a no-op (label already "Copy address"), on copy it
  // morphs to "Copied!", and on the 2s revert it morphs back.
  useEffect(() => {
    if (copyLabelRef.current) {
      morphText(copyLabelRef.current, emailCopied ? "Copied!" : "Copy address");
    }
  }, [emailCopied]);

  // Navbar, two states like the reference screenshots:
  // - Without scroll: flat, no pill container, just brand + links
  //   on the page background, home as a blue pill, hire as a
  //   pink/maroon pill, all links always visible.
  // - After scroll: the same bar becomes a dark pixel-corner bar
  //   container (blur + shadow + ring).
  // This replaces the earlier "hidden on hero" rule.
  // Scroll-spy: blue pill = the section actually on screen.
  // Previously home was hardcoded blue, so scrolling never
  // changed the navbar. Now the active section is recomputed
  // on every scroll: the last section whose top has passed
  // 150px from the viewport top (navbar height + margin).
  // Order matters because #videos sits inside #clients.
  const [active, setActive] = useState("top");

  useEffect(() => {
    const onScroll = () => {
      let current = "top";
      for (const id of ["top", "clients", "videos", "hire"]) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 150) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Slide overlay, back as the user wanted, WITH the leak fix:
  // - Hero is sticky again, clients card (z-20) slides up OVER it.
  // - NO zoom (no scale at all). The only extra is a hero
  //   fade-out: as the card covers the hero over one hero-height
  //   of scroll, hero opacity goes 1 -> 0. So once the card has
  //   covered it, the hero (video included) is invisible — it
  //   cannot leak into the hire section, the card sides, or the
  //   gap after the card, even though the hero keeps moving with
  //   the page afterwards. The fade uses raw scrollY (no spring
  //   lag), so it never lags behind and shows a video strip.
  // - The card itself still slides 80px -> 0 on the soft spring.
  // - A soft spring (low stiffness) on scrollY makes it all
  //   lazy/smooth instead of snapping to the scroll position.
  // - Reduced-motion users get no slide.
  const heroRef = useRef<HTMLElement>(null);
  const [heroHeight, setHeroHeight] = useState(800);
  useEffect(() => {
    const measure = () => {
      if (heroRef.current) setHeroHeight(heroRef.current.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 55, damping: 20, mass: 1 });
  const cardY = useTransform(smoothScrollY, [0, heroHeight], [80, 0]);
  const heroOpacity = useTransform(scrollY, [0, heroHeight], [1, 0]);
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] font-sans text-white">
      <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn cursorColor="#ffffff" cursorColorOnTarget="#a3e635" />
      {/* Intro loader: black screen, flipping zoom-in logo, then
          fades away to reveal this page rendered underneath. */}
      <IntroLoader />
      {/* Navbar: always transparent, no background at any scroll
          position — cleared in the v3 redesign. Text gets a soft
          drop shadow so it stays readable over the hero video. */}
      <header className="v2-nav-drop fixed inset-x-0 top-0 z-50 flex justify-center px-4 py-4">
        <nav className="flex w-full max-w-3xl items-center justify-between bg-transparent px-2 py-1 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
          <a href="#top" className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="NexusFX logo" className="h-8 w-8 object-cover" />
            <span className="font-pixelify text-xl font-bold text-lime-400">NexusFX</span>
          </a>
          <div className="flex items-center gap-1 font-pixelify text-xs uppercase sm:gap-2 sm:text-sm">
            <a
              href="#top"
             
              className={`px-2 sm:px-4 py-1 transition-all duration-300 ${
                active === "top"
                  ? "bg-[#3884ff] font-bold text-white shadow-[0_0_18px_rgba(56,132,255,0.6)] hover:scale-105"
                  : "text-white/80 hover:scale-105 hover:bg-white/10 hover:text-white"
              }`}
            >
              home
            </a>
            <a
              href="#clients"
             
              className={`px-2 sm:px-4 py-1 transition-all duration-300 ${
                active === "clients"
                  ? "bg-[#3884ff] font-bold text-white shadow-[0_0_18px_rgba(56,132,255,0.6)] hover:scale-105"
                  : "text-white/80 hover:scale-105 hover:bg-white/10 hover:text-white"
              }`}
            >
              clients
            </a>
            <a
              href="#videos"
             
              className={`px-2 sm:px-4 py-1 transition-all duration-300 ${
                active === "videos"
                  ? "bg-[#3884ff] font-bold text-white shadow-[0_0_18px_rgba(56,132,255,0.6)] hover:scale-105"
                  : "text-white/80 hover:scale-105 hover:bg-white/10 hover:text-white"
              }`}
            >
              videos
            </a>
            <a
              href="#hire"
             
              className={`v2-shine-wrap relative overflow-hidden px-2 sm:px-4 py-1 font-bold text-white transition-all duration-300 hover:scale-105 ${
                active === "hire"
                  ? "bg-[#3884ff] shadow-[0_0_18px_rgba(56,132,255,0.6)]"
                  : "bg-purple-700 ring-1 ring-purple-400/60 hover:bg-purple-600"
              }`}
            >
              hire <span aria-hidden="true" className="v2-shine-beam" />
            </a>
          </div>
        </nav>
      </header>

      {/* Scroll reveal wrapper: hero + clients share one parent, so the sticky hero can sit UNDER the sliding card, then scroll away with the wrapper once the card has covered it. */}
      <div className="relative">
      {/* Hero — full viewport, centred */}
      <motion.section
        ref={heroRef}
        id="top"
        style={{ opacity: reduceMotion ? 1 : heroOpacity }}
        className="sticky top-0 z-10 flex min-h-screen flex-col items-center justify-center text-center"
      >
        {/* Hero: the showreel video IS the background now — no card
            frame, ring, or shadow around it. Title sits over the
            video, as before. */}
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
          {/* Hero video: NexusFX showreel, user-supplied R2 link.
              Hotlinked (not copied into the repo). */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/showreel-poster.jpg"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-100"
          >
            {/* Optimized showreel, hosted in-repo (Vercel CDN) instead
                of the 81 MB / 29 Mbps R2 original: 720p on phones,
                1080p on larger screens, both 30fps with faststart. */}
            <source src="/showreel-720.mp4" type="video/mp4" media="(max-width: 640px)" />
            <source src="/showreel-1080.mp4" type="video/mp4" />
          </video>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] bg-black/20" />
          <div className="group v2-fade-up relative z-10 -rotate-2 border-2 border-lime-400/60 px-6 py-8 sm:px-10">
            <span className="absolute -left-2 -top-2 h-4 w-4 bg-lime-400" />
            <span className="absolute -right-2 -top-2 h-4 w-4 bg-lime-400" />
            <span className="absolute -bottom-2 -left-2 h-4 w-4 bg-lime-400" />
            <span className="absolute -bottom-2 -right-2 h-4 w-4 bg-lime-400" />
            <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 bg-lime-400" />
            <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 bg-lime-400" />
            <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 bg-lime-400" />
            <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 bg-lime-400" />
            <span className="absolute -bottom-5 right-4 bg-lime-400 px-4 py-1 font-mono text-[10px] font-bold text-black">
              NEXUSFX
            </span>
            <span className="v2-wobble relative inline-block px-2 py-4">
              <h1 className="v2-soft-blue-title font-pixelify text-[clamp(4.5rem,18vw,12.5rem)] font-extrabold leading-none tracking-tight">
                NexusFX
              </h1>
            </span>
            <p className="mt-6 font-minecraft text-sm leading-relaxed text-lime-300 sm:text-base">
              edits that hold attention
            </p>
          </div>
          <p className="v2-bounce-soft absolute bottom-6 z-10 bg-white/10 px-4 py-1 font-mono text-xs text-white/70 backdrop-blur">
            scroll ↓
          </p>
        </div>
      </motion.section>

      {/* Clients — inverted-U (arch-top) matte card. It still slides
          up over the hero on scroll (cardY), but the metal gradient,
          sheen, pixel corners and pixel strip are cleared: flat matte
          #16161a, no gloss. The arch top lets the hero video show in
          the corners above the curve. */}
      <section id="clients" className="relative z-20 w-full px-2 pb-24 sm:px-4">
        <motion.div style={{ y: reduceMotion ? 0 : cardY }} className="v3-arch relative w-full overflow-hidden bg-[#16161a] border border-white/10 px-4 pb-12 pt-20 sm:px-8 sm:pt-24 lg:px-12">
          <h2 className="relative text-center font-pixelify text-4xl font-bold leading-tight tracking-wide sm:text-6xl lg:text-7xl">
            Creators I&apos;ve worked with
          </h2>
          <div
            className="relative mx-auto mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:w-[46%] lg:grid-cols-3"
            onMouseLeave={() => setFeaturedClient(null)}
          >
            {CLIENTS.map((client, index) => {
              const featured = featuredClient === index;
              // Accent rotation across the four palette colours:
              // yellow, lime, purple, blue — one per tile.
              const accent = [
                { ring: "ring-yellow-400/80", shadow: "shadow-[0_0_28px_rgba(250,204,21,0.35)]", dot: "bg-yellow-400", text: "text-yellow-300", focus: "focus-visible:ring-yellow-400" },
                { ring: "ring-lime-400/80", shadow: "shadow-[0_0_28px_rgba(163,230,53,0.35)]", dot: "bg-lime-400", text: "text-lime-300", focus: "focus-visible:ring-lime-400" },
                { ring: "ring-purple-400/80", shadow: "shadow-[0_0_28px_rgba(192,132,252,0.35)]", dot: "bg-purple-400", text: "text-purple-300", focus: "focus-visible:ring-purple-400" },
                { ring: "ring-blue-400/80", shadow: "shadow-[0_0_28px_rgba(96,165,250,0.35)]", dot: "bg-blue-400", text: "text-blue-300", focus: "focus-visible:ring-blue-400" },
              ][index % 4];
              return (
                <a
                  key={client.name}
                  href={client.url}
                  data-cursor-label={client.name}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setFeaturedClient(index)}
                  onFocus={() => setFeaturedClient(index)}
                  onBlur={() => setFeaturedClient(null)}
                  className={`cursor-target relative aspect-square overflow-hidden bg-zinc-900 shadow-lg ring-1 ring-zinc-300/40 transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 ${accent.focus} ${
                    featured
                      ? `z-10 ring-2 ${accent.ring} ${accent.shadow}`
                      : ""
                  }`}
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-full w-full object-cover"
                  />
                  {/* HUD target-lock: four corner brackets, only on hover */}
                  <span aria-hidden="true" className={`pointer-events-none absolute inset-2 transition-opacity duration-200 ${featured ? "opacity-100" : "opacity-0"}`}>
                    <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-lime-400" />
                    <span className="absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-lime-400" />
                    <span className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-lime-400" />
                    <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-lime-400" />
                  </span>
                  {/* Scanline: sweeps top to bottom once per hover entry */}
                  {featured && (
                    <span aria-hidden="true" className="v2-tile-scan pointer-events-none absolute inset-x-0 h-[2px] bg-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.9)]" />
                  )}
                  {/* Rest name: always readable, so the grid reads as
                      creators at a glance instead of just logos —
                      a Pixelify name with a lime dot over a soft
                      gradient. It fades out as the hover info
                      wipes in, so the two never stack. */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-0 bottom-0 block bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 pb-2.5 pt-6 text-left transition-opacity duration-300 ${
                      featured ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-pixelify text-sm text-white">
                      <span className={`h-1.5 w-1.5 shrink-0 ${accent.dot}`} />
                      {client.name}
                    </span>
                  </span>
                  {/* Hover info: revealed by a left-to-right wipe, not a
                      slide/fade — name gets a short glitch flicker.
                      Name now matches the rest strip (Pixelify) and
                      subs are mono, for a HUD-style info panel. */}
                  <span
                    className="v2-wipe absolute inset-x-0 bottom-0 block bg-gradient-to-t from-black/95 via-black/70 to-transparent px-3 pb-3 pt-8 text-left"
                    style={{ clipPath: featured ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
                  >
                    <span className={`block font-pixelify text-sm text-white ${featured ? "v2-glitch" : ""}`}>{client.name}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-white/80">{client.desc}</span>
                    <span className={`mt-1 block font-mono text-[11px] font-semibold ${accent.text}`}>{client.subs}</span>
                  </span>
                </a>
              );
            })}
          </div>
          {/* Recent edits — v1 showcase, inside the same metal card,
              which now expands to the end of the showcase. */}
          <div id="videos" className="relative mt-16 scroll-mt-24 text-center">
            <h2 className="mt-6 font-pixelify text-4xl font-bold leading-tight tracking-wide sm:text-6xl lg:text-7xl">
              Recent edits
            </h2>
          </div>
        <div className="relative mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((video, vi) => (
            <article key={video.id}>
              <div className="relative aspect-video overflow-hidden bg-black shadow-lg ring-1 ring-zinc-300/40">
                {playingId === video.id ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="v2-video-reveal absolute inset-0 h-full w-full border-0"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPlayingId(video.id)}
                    aria-label={`Play ${video.title}`}
                    data-cursor-label="Play"
                    className="cursor-target group absolute inset-0 h-full w-full cursor-pointer"
                  >
                    <img
                      src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                      alt={video.title}
                      loading="lazy"
                      draggable={false}
                      className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                    />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className={`flex h-14 w-14 items-center justify-center bg-black text-white ring-1 ring-white/60 transition duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.18] ${["group-hover:bg-yellow-400 group-hover:text-black group-hover:shadow-[0_0_20px_rgba(250,204,21,0.85)]", "group-hover:bg-lime-400 group-hover:text-black group-hover:shadow-[0_0_20px_rgba(163,230,53,0.85)]", "group-hover:bg-purple-500 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.85)]", "group-hover:bg-blue-500 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.85)]"][vi % 4]}`}>
                        <Play size={24} weight="Filled" />
                      </span>
                    </span>
                  </button>
                )}
              </div>
              <h3 className="mt-3 text-left font-mono text-sm font-medium leading-snug text-white">
                {video.title}
              </h3>
              <a
                href={video.creatorUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor-label={video.creator}
                className="cursor-target mt-2 flex items-center gap-2 font-mono text-xs text-white/70 transition hover:text-white"
              >
                <img src={video.creatorLogo} alt={video.creator} className="h-5 w-5 object-cover" />
                {video.creator}
              </a>
            </article>
          ))}
        </div>
          <div className="relative mt-10 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] text-white/50">
            <span>CLIENTS · 06</span>
            <span>+</span>
            <span>NEXUSFX · 2026</span>
          </div>
        </motion.div>
      </section>
      </div>

      {/* Hire — the TextLoop ribbon and the Three.js character were
          both removed at the user's request. A plain heading, a
          slide-to-hire control (pattern idea from cuedesign.space,
          original code), and the unchanged contact tiles below. */}
      <section id="hire" className="relative z-10 pb-24">
        <div className="mx-auto max-w-5xl px-4 pt-4 text-center">
          <h2 className="font-pixelify text-4xl text-white sm:text-5xl">Hire me</h2>
        </div>
        <div className="mx-auto max-w-5xl px-4">
          {/* Hire panel, inspired by the researched portfolios
              (Felix-style simple contact structure, Tanner-style
              bold primary CTA, Matheus-style email + social
              buttons), in original code: one framed matte-metal
              panel holding the two contact tiles, so hire reads
              as one section instead of floating tiles. No site's
              layout or wording copied; no new copy added. */}
          <div className="relative mt-10 overflow-hidden bg-[#16161a] p-6 border border-white/10 sm:p-8">
            <div className="relative mb-6">
              <SlideToHire />
            </div>
            <div className="relative grid gap-6 text-left sm:grid-cols-5">
            <div className="group relative overflow-hidden bg-zinc-900 p-8 shadow-xl ring-1 ring-zinc-700 transition-shadow duration-500 motion-reduce:transition-none hover:shadow-[0_0_40px_rgba(163,230,53,0.35)] hover:ring-lime-400/60 sm:col-span-3">
              {/* Primary tile: solid zinc at rest, lime fill on
                  hover (no fire, no zoom) with a shine sweep, and
                  text/buttons flip to dark for readability. */}
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-lime-300 via-lime-400 to-lime-500 opacity-0 transition-opacity duration-500 motion-reduce:transition-none group-hover:opacity-100" />
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 blur-md transition-transform duration-700 motion-reduce:transition-none group-hover:translate-x-[400%]" />
              <p className="relative z-10 flex items-center gap-2 font-mono text-xs text-white/60 transition-colors duration-500 motion-reduce:transition-none group-hover:text-black/60">
                <Envelope size={16} weight="Filled" /> Email
              </p>
              <p className="relative z-10 mt-3 break-all font-pixelify text-xl text-white transition-colors duration-500 motion-reduce:transition-none group-hover:text-black">nexusfx.media@gmail.com</p>
              <div className="relative z-10 mt-6 flex flex-wrap gap-2">
                <a
                  href="mailto:nexusfx.media@gmail.com"
                  data-cursor-label="Email"
                  className="cursor-target bg-lime-400 px-6 py-3 text-base font-bold text-black transition duration-150 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 group-hover:bg-black group-hover:text-lime-400"
                >
                  Write an email
                </a>
                <button
                  type="button"
                  data-cursor-label="Copy"
                  onClick={() => {
                    navigator.clipboard?.writeText("nexusfx.media@gmail.com").catch(() => {});
                    setEmailCopied(true);
                    setTimeout(() => setEmailCopied(false), 2000);
                  }}
                  className="cursor-target bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 transition duration-150 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 group-hover:bg-black/10 group-hover:text-black group-hover:ring-black/20"
                >
                  <span ref={copyLabelRef} className="t-morph">Copy address</span>
                </button>
              </div>
            </div>
            <a
              href="https://www.instagram.com/nexu.fx4"
              target="_blank"
              rel="noreferrer"
              data-cursor-label="Instagram"
              className="cursor-target group relative overflow-hidden bg-zinc-900 p-8 shadow-xl ring-1 ring-zinc-700 transition-shadow duration-500 motion-reduce:transition-none hover:shadow-[0_0_40px_rgba(168,85,247,0.35)] hover:ring-purple-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 sm:col-span-2"
            >
              {/* Secondary tile: same solid + fill + shine language
                  as email, but pink (not a lime copy), no fire, no
                  zoom — the arrow slides diagonally instead. */}
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-700 opacity-0 transition-opacity duration-500 motion-reduce:transition-none group-hover:opacity-100" />
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 blur-md transition-transform duration-700 motion-reduce:transition-none group-hover:translate-x-[400%]" />
              <p className="relative z-10 flex items-center gap-2 font-mono text-xs text-white/60 transition-colors duration-500 motion-reduce:transition-none group-hover:text-black/60">
                <Instagram size={16} weight="Filled" /> Instagram
              </p>
              <p className="relative z-10 mt-3 font-pixelify text-xl text-white transition-colors duration-500 motion-reduce:transition-none group-hover:text-black">@nexu.fx4</p>
              <span className="relative z-10 mt-6 inline-flex items-center gap-1 bg-white/10 px-5 py-2 text-sm font-semibold text-purple-400 ring-1 ring-white/20 transition duration-150 group-hover:bg-black/10 group-hover:text-black group-hover:ring-black/20">
                Visit profile <span className="inline-block transition-transform duration-300 motion-reduce:transition-none group-hover:-translate-y-0.5 group-hover:translate-x-0.5"><ArrowUpRight size={16} weight="Filled" /></span>
              </span>
            </a>
            </div>
          </div>
        </div>
      </section>

      {/* Site footer */}
      <footer className="relative z-10 px-4 pb-16">
        <p className="text-center font-mono text-xs text-white/40">
          © 2026 NexusFX
        </p>
      </footer>
    </div>
  );
}
