"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, ArrowRight, Sun, Moon } from "lucide-react";
import { flushSync } from "react-dom";
// --- Floating letter data — fixed positions for SSR stability ---
const LETTERS = [
  { letter: "A", top: "10%", left: "7%", size: "text-5xl", op: "0.20", blur: "1px", anim: "drift-a", delay: "0s", depth: "25px" },
  { letter: "B", top: "68%", left: "87%", size: "text-6xl", op: "0.15", blur: "2px", anim: "drift-b", delay: "4s", depth: "-15px" },
  { letter: "C", top: "83%", left: "18%", size: "text-3xl", op: "0.18", blur: "1px", anim: "drift-c", delay: "8s", depth: "40px" },
  { letter: "D", top: "18%", left: "80%", size: "text-5xl", op: "0.22", blur: "2px", anim: "drift-a", delay: "12s", depth: "-30px" },
  { letter: "E", top: "44%", left: "61%", size: "text-7xl", op: "0.12", blur: "3px", anim: "drift-b", delay: "6s", depth: "10px" },
  { letter: "F", top: "77%", left: "43%", size: "text-4xl", op: "0.25", blur: "1px", anim: "drift-c", delay: "2s", depth: "-25px" },
  { letter: "G", top: "7%", left: "51%", size: "text-4xl", op: "0.18", blur: "2px", anim: "drift-a", delay: "18s", depth: "35px" },
  { letter: "H", top: "52%", left: "11%", size: "text-5xl", op: "0.20", blur: "2px", anim: "drift-b", delay: "10s", depth: "-10px" },
  { letter: "Q", top: "30%", left: "31%", size: "text-2xl", op: "0.15", blur: "1px", anim: "drift-c", delay: "14s", depth: "20px" },
  { letter: "R", top: "40%", left: "4%", size: "text-5xl", op: "0.22", blur: "2px", anim: "drift-b", delay: "22s", depth: "-40px" },
  { letter: "W", top: "5%", left: "69%", size: "text-3xl", op: "0.18", blur: "1px", anim: "drift-a", delay: "16s", depth: "15px" },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [explanation, setExplanation] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [ripple, setRipple] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Set up global mouse listener for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Map cursor position to range roughly [-1, 1] relative to center
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--mouse-x", x.toString());
        document.documentElement.style.setProperty("--mouse-y", y.toString());
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Apply theme class to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (theme === "light") {
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
    }
  }, [theme]);

  function handleThemeToggle() {
    const isDarkNow = theme === "dark";
    if (toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      document.documentElement.style.setProperty("--toggle-x", `${x}px`);
      document.documentElement.style.setProperty("--toggle-y", `${y}px`);
    }

    // @ts-ignore - view transition API
    if (!document.startViewTransition) {
      setTheme(isDarkNow ? "light" : "dark");
      return;
    }

    // @ts-ignore
    document.startViewTransition(() => {
      flushSync(() => {
        setTheme(isDarkNow ? "light" : "dark");
      });
    });
  }

  async function handleSubmit() {
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");
    setExplanation("");
    setShowExplanation(false);
    try {
      const res = await fetch("http://127.0.0.1:8000/correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      
      const fullText = data.result || "";
      const parts = fullText.split("📝 Explanation:");
      
      if (parts.length > 1) {
        setResponse(parts[0].replace("✅ Corrected:", "").trim());
        setExplanation(parts[1].trim());
      } else {
        setResponse(fullText);
      }
    } catch {
      setResponse("❌ Something went wrong. Is your backend running?");
    } finally {
      setLoading(false);
    }
  }

  const isDark = theme === "dark";

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden font-sans flex flex-col justify-center items-center"
      style={{
        backgroundColor: isDark ? "#060606" : "#e6dfd1",
        color: isDark ? "#ede9e3" : "#1a1814",
      }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(201,168,76,0.06) 0%, transparent 70%)"
            : "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139,105,20,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Floating letters */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          {LETTERS.map(({ letter, top, left, size, op, blur, anim, delay, depth }) => (
            <div
              key={letter}
              className="absolute pointer-events-none"
              style={{
                top,
                left,
                transform: `translate(calc(var(--mouse-x, 0) * ${depth}), calc(var(--mouse-y, 0) * ${depth}))`,
                transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
            >
              <div
                className={`font-heading ${size}`}
                style={{
                  opacity: op,
                  filter: `blur(${blur})`,
                  animationName: anim,
                  animationDuration: anim === "drift-a" ? "50s" : anim === "drift-b" ? "60s" : "70s",
                  animationTimingFunction: "cubic-bezier(0.37,0,0.63,1)",
                  animationIterationCount: "infinite",
                  animationDelay: delay,
                  color: isDark ? "#c9a84c" : "#8b6914",
                  transition: "color 0.6s ease, opacity 0.6s ease",
                }}
              >
                {letter}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Theme toggle */}
      <div className="fixed top-5 right-6 z-30">
        <button
          ref={toggleRef}
          onClick={handleThemeToggle}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-500"
          style={{
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)",
            border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
            color: isDark ? "#806040" : "#8b6914",
            backdropFilter: "blur(12px)",
          }}
          aria-label="Toggle theme"
        >
          {isDark
            ? <><Sun className="w-3.5 h-3.5" /> Light</>
            : <><Moon className="w-3.5 h-3.5" /> Dark</>
          }
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-3xl px-5 sm:px-8 flex flex-col items-center">

        {/* Heading */}
        <div
          className="text-center w-full opacity-0 animate-fade-in-up"
          style={{ animationDelay: "80ms", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          {/* Eyebrow */}
          <p
            className="text-xs uppercase tracking-[0.2em] font-medium mb-6"
            style={{ color: isDark ? "#5a5040" : "#9c7d33", transition: "color 0.5s ease" }}
          >
            AI Grammar Correction
          </p>

          {/* Main heading */}
          <h1
            className="font-heading font-medium leading-[1.0] tracking-[-0.03em] mb-6"
            style={{
              fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
              color: isDark ? "#e8e3da" : "#1a1814",
              transition: "color 0.5s ease",
            }}
          >
            Correct your{" "}
            <span
              className={`italic text-transparent bg-clip-text transition-all duration-500 bg-gradient-to-br ${isDark
                ? "from-[#c8a84b] via-[#a07830] to-[#c8a84b]"
                : "from-[#8b6914] via-[#6b4f0f] to-[#8b6914]"
                }`}
            >
              grammar
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto"
            style={{ color: isDark ? "#6b6560" : "#7a7060", transition: "color 0.5s ease" }}
          >
            Paste your text below — our AI refines structure, clarity, and tone instantly.
          </p>
        </div>

        {/* Input card */}
        <div
          className="w-full opacity-0 animate-fade-in-up group relative"
          style={{ animationDelay: "260ms" }}
        >
          {/* Soft glow on focus */}
          <div
            className="absolute -inset-px rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 pointer-events-none"
            style={{
              background: isDark
                ? "radial-gradient(ellipse at top left, rgba(180,140,50,0.12) 0%, transparent 60%)"
                : "radial-gradient(ellipse at top left, rgba(139,105,20,0.08) 0%, transparent 60%)",
              filter: "blur(8px)",
            }}
          />

          <div
            className="relative w-full rounded-2xl overflow-hidden flex flex-col transition-all duration-500"
            style={{
              background: isDark ? "rgba(255,255,255,0.025)" : "rgba(253,251,247,0.85)",
              border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(139,105,20,0.18)",
              boxShadow: isDark
                ? "0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)"
                : "0 16px 40px rgba(100,75,10,0.08), inset 0 1px 0 rgba(255,255,255,1)",
              backdropFilter: "blur(40px)",
              transition: "background 0.5s ease, border 0.5s ease, box-shadow 0.5s ease",
            }}
          >
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g. i goed to the store and buyed some apple..."
              className="w-full bg-transparent resize-none outline-none font-light leading-relaxed"
              style={{
                color: isDark ? "#e8e3da" : "#1a1814",
                padding: "clamp(1.25rem, 3vw, 2rem)",
                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                minHeight: "clamp(130px, 20vw, 190px)",
                caretColor: "#c9a84c",
              }}
              onKeyDown={e => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
              }}
            />

            {/* Input footer */}
            <div
              className="flex items-center justify-between px-5 md:px-7 py-3.5"
              style={{
                borderTop: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.06)",
                background: isDark ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.02)",
              }}
            >
              <div
                className="text-xs flex items-center gap-2"
                style={{ color: isDark ? "#404040" : "#b0a898" }}
              >
                <kbd
                  className="px-2 py-0.5 rounded text-[10px]"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)",
                    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  ⌘ Enter
                </kbd>
                <span>to refine</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !input.trim()}
                className="group/btn relative overflow-hidden flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #c8a84b 0%, #9c7830 100%)",
                  color: "#0c0900",
                  boxShadow: "0 2px 12px rgba(180,140,50,0.2)",
                }}
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center gap-1.5">
                  {loading ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Refining…</>
                  ) : (
                    <><span>Correct it</span><ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" /></>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Output */}
        <div
          className={`w-full mt-5 transition-all duration-700 origin-top ${response || loading ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none h-0 overflow-hidden"}`}
        >
          <div
            className="relative w-full rounded-2xl overflow-hidden"
            style={{
              background: isDark ? "rgba(255,255,255,0.02)" : "rgba(253,251,247,0.85)",
              border: isDark ? "1px solid rgba(180,140,50,0.12)" : "1px solid rgba(139,105,20,0.18)",
              boxShadow: isDark
                ? "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)"
                : "0 12px 32px rgba(100,75,10,0.08), inset 0 1px 0 rgba(255,255,255,1)",
              backdropFilter: "blur(40px)",
              padding: "clamp(1.25rem, 3vw, 2rem)",
              minHeight: "6rem",
              transition: "background 0.5s ease, border 0.5s ease",
            }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[5rem] gap-3">
                <div className="flex items-center gap-1.5">
                  {[0, 150, 300].map(d => (
                    <span
                      key={d}
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: "#c9a84c", animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
                <span className="text-[10px] uppercase tracking-[0.18em] font-medium" style={{ color: "#7a6535" }}>
                  Analyzing
                </span>
              </div>
            ) : (
              <div className="animate-fade-in-up" style={{ animationDelay: "0ms" }}>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-semibold"
                    style={{ color: isDark ? "#6a5a30" : "#9c7d33" }}
                  >
                    <span className="w-3 h-px" style={{ background: "currentColor" }} />
                    Refined result
                  </div>
                  
                  {explanation && (
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="text-[10px] uppercase tracking-widest font-semibold px-3 py-1.5 rounded-md transition-all duration-300"
                      style={{
                        background: showExplanation 
                          ? (isDark ? "rgba(201,168,76,0.15)" : "rgba(139,105,20,0.15)") 
                          : (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"),
                        color: showExplanation
                          ? (isDark ? "#c9a84c" : "#8b6914")
                          : (isDark ? "#a0a0a0" : "#707070"),
                        border: showExplanation
                          ? (isDark ? "1px solid rgba(201,168,76,0.3)" : "1px solid rgba(139,105,20,0.3)")
                          : (isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)"),
                      }}
                    >
                      {showExplanation ? "Hide Explanation" : "Explain"}
                    </button>
                  )}
                </div>
                
                <div
                  className="font-light leading-relaxed whitespace-pre-wrap"
                  style={{
                    color: isDark ? "#d8d0c4" : "#2a2418",
                    paddingLeft: "1rem",
                    borderLeft: `2px solid ${isDark ? "rgba(201,168,76,0.15)" : "rgba(139,105,20,0.18)"}`,
                    fontSize: "clamp(1rem, 2.2vw, 1.15rem)",
                  }}
                >
                  {response}
                </div>

                {/* Explanation Drawer */}
                <div 
                  className={`transition-all duration-500 overflow-hidden ${showExplanation ? 'opacity-100 max-h-[500px] mt-6 pt-5' : 'opacity-0 max-h-0 mt-0 pt-0 border-transparent'}`}
                  style={{
                    borderTop: showExplanation ? (isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.08)") : "none"
                  }}
                >
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-semibold mb-3 opacity-80" style={{ color: isDark ? "#6a5a30" : "#9c7d33" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor" }} />
                    Correction logic
                  </div>
                  <div
                    className="font-light leading-relaxed text-sm md:text-base whitespace-pre-wrap"
                    style={{
                      color: isDark ? "#a8a295" : "#605a50",
                      paddingLeft: "0.5rem",
                    }}
                  >
                    {explanation}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer */}
      <p
        className="fixed bottom-5 text-[10px] tracking-widest uppercase opacity-30"
        style={{ color: isDark ? "#c9a84c" : "#8b6914", transition: "color 0.5s ease" }}
      >
        Powered by LLaMA 3.3 · FastAPI + Next.js
      </p>

      {/* Keyframes */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes drift-a {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          25%       { transform: translate(7px, -12px) rotate(2deg); }
          50%       { transform: translate(-5px, -20px) rotate(-1deg); }
          75%       { transform: translate(10px, -8px) rotate(3deg); }
        }
        @keyframes drift-b {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          25%       { transform: translate(-9px, 14px) rotate(-2deg); }
          50%       { transform: translate(6px, 22px) rotate(1deg); }
          75%       { transform: translate(-12px, 10px) rotate(-3deg); }
        }
        @keyframes drift-c {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          33%       { transform: translate(11px, -9px) rotate(2deg); }
          66%       { transform: translate(-7px, 16px) rotate(-2deg); }
        }
        @keyframes fade-in-up {
          0%   { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes theme-ripple {
          0%   { transform: translate(-50%, -50%) scale(1);   opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(260); opacity: 0; }
        }
        .animate-drift-a      { animation: drift-a  50s cubic-bezier(0.37,0,0.63,1) infinite; }
        .animate-drift-b      { animation: drift-b  60s cubic-bezier(0.37,0,0.63,1) infinite; }
        .animate-drift-c      { animation: drift-c  70s cubic-bezier(0.37,0,0.63,1) infinite; }
        .animate-fade-in-up   { animation: fade-in-up 0.75s cubic-bezier(0.16,1,0.3,1) forwards; }
        
        ::view-transition-group(root) {
          animation-duration: 0.8s;
          animation-timing-function: cubic-bezier(0.8, 0, 0.2, 1);
        }
        ::view-transition-new(root) {
          z-index: 9999;
          animation: clip-expand 0.8s cubic-bezier(0.8, 0, 0.2, 1) forwards;
        }
        ::view-transition-old(root) {
          z-index: 1;
          animation: none;
        }
        .dark::view-transition-new(root) {
          z-index: 1;
          animation: none;
          clip-path: none;
        }
        .dark::view-transition-old(root) {
          z-index: 9999;
          animation: clip-contract 0.8s cubic-bezier(0.8, 0, 0.2, 1) forwards;
        }
        @keyframes clip-expand {
          from { clip-path: circle(0px at var(--toggle-x, 50vw) var(--toggle-y, 50vh)); }
          to { clip-path: circle(150% at var(--toggle-x, 50vw) var(--toggle-y, 50vh)); }
        }
        @keyframes clip-contract {
          from { clip-path: circle(150% at var(--toggle-x, 50vw) var(--toggle-y, 50vh)); }
          to { clip-path: circle(0px at var(--toggle-x, 50vw) var(--toggle-y, 50vh)); }
        }
      `}} />
    </main>
  );
}