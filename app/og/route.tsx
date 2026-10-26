import { ImageResponse } from "next/og";

// v2 OG image — 1200x630, large and flashy on purpose, unlike v1's
// plain layout: black base, lime/pink/violet glow blobs, diagonal
// flash strips, hero-style corner handles, and a huge pixel
// NEXUSFX name (Minecraft font, the v2 pixel font) over a
// Geist description. Fonts and logo are fetched from public/
// at request time, same pattern as v1's /og route. Satori
// (next/og) does not render WebP, so the logo must stay PNG.

const getFont = async (request: Request, path: string) => {
  const res = await fetch(new URL(path, request.url));
  return res.arrayBuffer();
};

const getLogoDataUri = async (request: Request) => {
  try {
    const res = await fetch(new URL("/logo.png", request.url));
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/png;base64,${base64}`;
  } catch {
    return null;
  }
};

export const GET = async (request: Request) => {
  try {
    const [minecraft, geist, logoDataUri] = await Promise.all([
      getFont(request, "/fonts/Minecraft.ttf"),
      getFont(request, "/fonts/Geist-Regular.ttf"),
      getLogoDataUri(request),
    ]);

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            padding: 56,
            backgroundColor: "#0a0a0a",
            color: "#ffffff",
            position: "relative",
            overflow: "hidden",
            fontFamily: "'Geist', sans-serif",
          }}
        >
          {/* Glow blobs */}
          <div
            style={{
              position: "absolute",
              right: -120,
              top: -160,
              width: 520,
              height: 520,
              borderRadius: "50%",
              backgroundColor: "#a3e635",
              opacity: 0.28,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -140,
              bottom: -180,
              width: 520,
              height: 520,
              borderRadius: "50%",
              backgroundColor: "#f7078e",
              opacity: 0.32,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 180,
              bottom: -120,
              width: 380,
              height: 380,
              borderRadius: "50%",
              backgroundColor: "#a855f7",
              opacity: 0.25,
            }}
          />
          {/* Flash strips along the bottom edge only — the earlier
              diagonal strips crossed the big name and hurt
              readability, so they were removed. */}
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              height: 10,
              backgroundColor: "#a3e635",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 10,
              width: "100%",
              height: 4,
              backgroundColor: "#f7078e",
            }}
          />
          {/* Hero-style corner handles */}
          <div style={{ position: "absolute", left: 24, top: 24, width: 20, height: 20, backgroundColor: "#a3e635" }} />
          <div style={{ position: "absolute", right: 24, top: 24, width: 20, height: 20, backgroundColor: "#f7078e" }} />
          <div style={{ position: "absolute", left: 24, bottom: 24, width: 20, height: 20, backgroundColor: "#f7078e" }} />
          <div style={{ position: "absolute", right: 24, bottom: 24, width: 20, height: 20, backgroundColor: "#a3e635" }} />
          {/* Sparkle diamonds as shapes, not characters — the ✦
              glyph is in neither loaded font and rendered as tofu. */}
          <div
            style={{
              position: "absolute",
              right: 90,
              top: 100,
              width: 22,
              height: 22,
              backgroundColor: "#a3e635",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 80,
              bottom: 170,
              width: 18,
              height: 18,
              backgroundColor: "#f7078e",
              transform: "rotate(45deg)",
            }}
          />

          {/* Top row: logo + handle pill */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {logoDataUri ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoDataUri} alt="" width={72} height={72} style={{ borderRadius: 16 }} />
              ) : null}
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 2 }}>NEXUSFX</div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 20px",
                borderRadius: 999,
                backgroundColor: "#5b1a3a",
                border: "2px solid #f7078e",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              @nexu.fx4
            </div>
          </div>

          {/* Big pixel name */}
          <div style={{ display: "flex", flexDirection: "column", marginTop: 64, position: "relative" }}>
            <div
              style={{
                fontFamily: "'Minecraft', sans-serif",
                fontSize: 148,
                lineHeight: 1,
                color: "#a3e635",
              }}
            >
              NEXUSFX
            </div>
            <div
              style={{
                fontFamily: "'Minecraft', sans-serif",
                fontSize: 30,
                marginTop: 18,
                color: "#ffffff",
              }}
            >
              VIDEO EDITOR FOR YOUTUBERS &amp; GAMING CREATORS
            </div>
            <div style={{ fontSize: 30, marginTop: 16, color: "rgba(255,255,255,0.85)", maxWidth: 900 }}>
              High-retention YouTube &amp; gaming edits that hold attention to the end.
            </div>
          </div>

          {/* Bottom row: creators + hire pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "auto",
              position: "relative",
            }}
          >
            <div style={{ fontSize: 22, color: "rgba(255,255,255,0.7)" }}>
              GamerFleet • I. M. Bixu • BeckBros • BeckBroBlox • SarahGrace • Ayush Bhandari
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 28px",
                borderRadius: 999,
                backgroundColor: "#a3e635",
                color: "#000000",
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              HIRE ME ↗
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: "Minecraft", data: minecraft, weight: 400, style: "normal" },
          { name: "Geist", data: geist, weight: 400, style: "normal" },
        ],
      },
    );
  } catch (error) {
    console.error("Failed to generate OG image:", error);
    return Response.json({ error: "Failed to generate OG image" }, { status: 500 });
  }
};
