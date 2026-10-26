"use client";

import { useState } from "react";

const SHOWREEL =
  "https://pub-d762446b1f924e5cabe93dad536beb79.r2.dev/Show%20reel%20(1).mp4";

// Creators copied from NexusFX v1/v2. Subscriber counts were read from the
// official YouTube channel pages on 2026-10-25 and will drift over time.
const CREATORS = [
  {
    name: "GamerFleet",
    logo: "/creators/gamerfleet.jpg",
    url: "https://www.youtube.com/@GamerFleet",
    subs: "6.05M subscribers",
    desc: "Indian gaming creator — Minecraft, Lilyville series",
  },
  {
    name: "I. M. Bixu",
    logo: "/creators/imbixu.jpg",
    url: "https://www.youtube.com/@imbixu",
    subs: "4.46M subscribers",
    desc: "Gaming creator — horror & gameplay",
  },
  {
    name: "BeckBros",
    logo: "/creators/beckbros.jpg",
    url: "https://www.youtube.com/@beckbros",
    subs: "698K subscribers",
    desc: "IRL channel — funny videos & challenges with friends",
  },
  {
    name: "BeckBroBlox",
    logo: "/creators/beckbroblox.jpg",
    url: "https://www.youtube.com/@BeckBroBlox",
    subs: "158K subscribers",
    desc: "Roblox gameplay",
  },
  {
    name: "SarahGrace",
    logo: "/creators/sarahgrace.jpg",
    url: "https://www.youtube.com/@TheSarahGrace",
    subs: "3.76M subscribers",
    desc: "Tech, unboxing & fun — iPhone / Apple",
  },
  {
    name: "Ayush Bhandari",
    logo: "/creators/ayushbhandari.jpg",
    url: "https://www.youtube.com/@AyushBhandari",
    subs: "6.74M subscribers",
    desc: "Experience & challenge videos",
  },
];

// Recent edits carried over from v1/v2's showcase picks. These are the
// placeholder picks from v2 — replace with confirmed portfolio pieces.
const VIDEOS = [
  { id: "voAnIhI5PF8", title: "I MET THE PRIME MINISTER OF INDIA", creator: "GamerFleet" },
  { id: "H5fyiYtyLjw", title: "Finding EVERY ANOMALY in SCHOOL!", creator: "I. M. Bixu" },
  { id: "zbM-A_VKd58", title: "BeckBro's Cereal Tier List", creator: "BeckBros" },
  { id: "2JHbnL5rj6c", title: "BeckBros Play Heave Ho 2", creator: "BeckBroBlox" },
  { id: "Jaj75z2hGwo", title: "I 3D Printed a FOLDABLE iPhone...", creator: "SarahGrace" },
  { id: "HsMemCsMGyc", title: "I Tried Every Celebrity Experience!", creator: "Ayush Bhandari" },
];

const EMAIL = "nexusfx.media@gmail.com";
const INSTAGRAM_URL = "https://www.instagram.com/nexu.fx4";

export default function Home() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      /* clipboard unavailable — mailto link still works */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#0c1117] text-[#f2f4f6]">
      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#233042] bg-[#0c1117]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#top" className="font-display text-xl font-black tracking-tight">
            NEXUS<span className="text-[#ffb703]">FX</span>
          </a>
          <nav className="flex items-center gap-5 text-sm font-medium">
            <a href="#creators" className="hidden text-[#9aa7b4] hover:text-white sm:inline">
              Creators
            </a>
            <a href="#videos" className="hidden text-[#9aa7b4] hover:text-white sm:inline">
              Recent edits
            </a>
            <a
              href="#hire"
              className="rounded-full bg-[#ffb703] px-4 py-2 font-semibold text-[#0c1117] hover:bg-[#ffc733] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb703]"
            >
              Hire me
            </a>
          </nav>
        </div>
      </header>

      {/* Hero — showreel first, title over the video */}
      <section id="top" className="relative flex min-h-screen items-end overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={SHOWREEL}
          muted
          autoPlay
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1117] via-[#0c1117]/40 to-transparent" />
        <div className="v3-fade-up relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-32">
          <p className="font-mono text-xs tracking-widest text-[#ffb703]">
            VIDEO EDITOR FOR YOUTUBERS &amp; GAMING CREATORS
          </p>
          <h1 className="mt-4 font-display text-6xl font-black leading-[0.95] tracking-tight sm:text-8xl">
            NEXUSFX
          </h1>
          <p className="mt-4 max-w-xl text-lg text-[#d7dee6]">
            Edits that hold attention. High-retention YouTube and gaming videos,
            cut so people actually finish watching.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#hire"
              className="rounded-full bg-[#ffb703] px-6 py-3 font-semibold text-[#0c1117] hover:bg-[#ffc733]"
            >
              Hire NexusFX
            </a>
            <a
              href="#creators"
              className="rounded-full border border-[#9aa7b4] px-6 py-3 font-semibold hover:border-white"
            >
              See who he edits for
            </a>
          </div>
        </div>
      </section>

      {/* Edit-timeline strip — the one subject-specific motif */}
      <div className="border-y border-[#233042] bg-[#131a24]" aria-hidden="true">
        <div className="mx-auto flex max-w-6xl items-stretch gap-1 px-5 py-3 font-mono text-[11px] text-[#9aa7b4]">
          <span className="w-2 bg-[#ffb703]" />
          <span className="flex-1 truncate px-2 py-1">00:00 — SHOWREEL</span>
          <span className="hidden flex-1 truncate px-2 py-1 sm:block">00:12 — CREATORS</span>
          <span className="hidden flex-1 truncate px-2 py-1 md:block">00:24 — RECENT EDITS</span>
          <span className="w-px bg-[#ffb703]" />
          <span className="px-2 py-1 text-white">▶</span>
        </div>
      </div>

      {/* Creators */}
      <section id="creators" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
              Worked with
            </h2>
            <p className="mt-2 max-w-lg text-[#9aa7b4]">
              Creators NexusFX has edited for, with their channels linked.
            </p>
          </div>
          <p className="font-mono text-xs text-[#9aa7b4]">06 CREATORS</p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CREATORS.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-2xl border border-[#233042] bg-[#131a24] transition-colors hover:border-[#ffb703]"
            >
              <img src={c.logo} alt={c.name} className="aspect-square w-full object-cover" />
              <div className="p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl font-bold">{c.name}</h3>
                  <span className="font-mono text-[11px] text-[#9aa7b4]">{c.subs}</span>
                </div>
                <p className="mt-1 text-sm text-[#9aa7b4]">{c.desc}</p>
                <p className="mt-3 text-sm font-semibold text-[#ffb703] group-hover:underline">
                  Visit channel →
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Recent edits */}
      <section id="videos" className="border-t border-[#233042] bg-[#0a0e14]">
        <div className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
          <h2 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
            Recent edits
          </h2>
          <p className="mt-2 max-w-lg text-[#9aa7b4]">
            Tap a thumbnail to play it here. One video plays at a time.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VIDEOS.map((v) => (
              <article
                key={v.id}
                className="overflow-hidden rounded-2xl border border-[#233042] bg-[#131a24]"
              >
                <div className="relative aspect-video">
                  {playing === v.id ? (
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube.com/embed/${v.id}?autoplay=1`}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlaying(v.id)}
                      className="group relative block h-full w-full text-left focus-visible:outline-2 focus-visible:outline-[#ffb703]"
                      aria-label={`Play ${v.title}`}
                    >
                      <img
                        src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <span className="absolute inset-0 grid place-items-center bg-black/30">
                        <span className="grid h-14 w-14 place-items-center rounded-full bg-[#ffb703] text-xl text-[#0c1117]">
                          ▶
                        </span>
                      </span>
                    </button>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold leading-snug">{v.title}</h3>
                  <p className="mt-1 text-sm text-[#9aa7b4]">{v.creator}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Hire */}
      <section id="hire" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
        <div className="rounded-2xl border border-[#ffb703]/40 bg-[#131a24] p-8 sm:p-10">
          <h2 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
            Hire NexusFX
          </h2>
          <p className="mt-3 max-w-lg text-[#9aa7b4]">
            Got a video that needs to hold attention? Send the idea and he will
            cut it into something people actually finish.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#0c1117] p-6">
              <p className="text-sm font-semibold">Email</p>
              <p className="mt-2 break-all font-mono text-lg">{EMAIL}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`mailto:${EMAIL}`}
                  className="rounded-full bg-[#ffb703] px-5 py-2.5 text-sm font-semibold text-[#0c1117] hover:bg-[#ffc733]"
                >
                  Write an email
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="rounded-full border border-[#9aa7b4] px-5 py-2.5 text-sm font-semibold hover:border-white"
                >
                  {copied ? "Copied!" : "Copy address"}
                </button>
              </div>
            </div>
            <div className="rounded-xl bg-[#0c1117] p-6">
              <p className="text-sm font-semibold">Instagram</p>
              <p className="mt-2 font-mono text-lg">@nexu.fx4</p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block rounded-full border border-[#9aa7b4] px-5 py-2.5 text-sm font-semibold hover:border-white"
              >
                Visit profile →
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#233042] py-8 text-center text-sm text-[#9aa7b4]">
        © 2026 NexusFX
      </footer>
    </main>
  );
}
