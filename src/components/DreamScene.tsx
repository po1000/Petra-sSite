"use client";
import { useRef, useState } from "react";
import { site } from "@/lib/site";

// Fixed numbers (not random) so the server and browser render the same thing.
const bubbles = [
  { l: 8, s: 34, d: 0, t: 16 }, { l: 18, s: 18, d: 4, t: 13 }, { l: 27, s: 52, d: 8, t: 20 },
  { l: 38, s: 22, d: 2, t: 15 }, { l: 52, s: 40, d: 10, t: 22 }, { l: 61, s: 16, d: 6, t: 12 },
  { l: 70, s: 46, d: 1, t: 19 }, { l: 79, s: 24, d: 9, t: 14 }, { l: 88, s: 30, d: 5, t: 17 },
  { l: 45, s: 14, d: 12, t: 11 }, { l: 93, s: 20, d: 3, t: 16 }, { l: 3, s: 26, d: 11, t: 18 },
];
const sparkles = [
  [12, 30], [22, 62], [35, 18], [48, 44], [57, 26], [66, 58], [74, 20], [83, 40], [90, 66], [40, 70], [28, 40], [62, 12],
];

// Homepage background. If site.heroVideo is set, plays that video instead.
export default function DreamScene() {
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  return (
    <div className="absolute inset-0 overflow-hidden grain" aria-hidden={!site.heroVideo}>
      {site.heroVideo ? (
        <video ref={video} src={site.heroVideo} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <>
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #6db8ff 0%, #a9d8ff 28%, #dff1ff 52%, #d9f2dc 74%, #f4fbff 100%)" }} />
          {/* light rays */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[70vw] h-[90vh] opacity-60 blur-2xl" style={{ background: "conic-gradient(from 160deg at 50% 0%, transparent 0deg, #ffffff 12deg, transparent 24deg, #ffffff 36deg, transparent 50deg)" }} />
          {/* drifting clouds */}
          <div className="absolute top-[12%] left-[10%] w-[40vw] h-[18vh] rounded-full bg-white blur-3xl opacity-90" style={{ animation: "drift 18s ease-in-out infinite" }} />
          <div className="absolute top-[22%] right-[5%] w-[35vw] h-[16vh] rounded-full bg-white blur-3xl opacity-80" style={{ animation: "drift 24s ease-in-out infinite reverse" }} />
          {/* soft greenery at the edges */}
          <div className="absolute bottom-[10%] -left-[8%] w-[38vw] h-[50vh] rounded-full blur-3xl opacity-70" style={{ background: "radial-gradient(circle, #79c96b, #b6e6a6 55%, transparent 75%)" }} />
          <div className="absolute bottom-[14%] -right-[8%] w-[36vw] h-[46vh] rounded-full blur-3xl opacity-70" style={{ background: "radial-gradient(circle, #6cc283, #b3e4b4 55%, transparent 75%)" }} />
          {/* water shimmer */}
          <div className="absolute bottom-0 inset-x-0 h-[28vh] blur-xl opacity-70" style={{ background: "linear-gradient(180deg, transparent, #d9efff 40%, #f4fbff)" }} />
          {bubbles.map((b, i) => (
            <div key={i} className="soap absolute -bottom-16" style={{ left: `${b.l}%`, width: b.s * 1.6, height: b.s * 1.6, animation: `rise ${b.t}s linear ${b.d}s infinite` }} />
          ))}
          {sparkles.map(([x, y], i) => (
            <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_3px_rgba(255,255,255,0.9)]" style={{ left: `${x}%`, top: `${y}%`, animation: `twinkle ${2 + (i % 4)}s ease-in-out ${i * 0.3}s infinite` }} />
          ))}
        </>
      )}
      {/* misty white vignette around the edges */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 85% 80% at 50% 44%, transparent 45%, rgba(255,255,255,0.55) 75%, #fff 100%)" }} />
      {site.heroVideo && (
        <button
          className="absolute left-5 bottom-6 z-10 w-11 h-11 rounded-full glass grid place-items-center"
          onClick={() => { if (video.current) { video.current.muted = !muted; setMuted(!muted); } }}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
        >
          {muted ? "🔇" : "🔊"}
        </button>
      )}
    </div>
  );
}
