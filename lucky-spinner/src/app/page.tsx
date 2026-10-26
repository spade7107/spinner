"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const defaultOptions = [
  "Alice",
  "Ben",
  "Charlie",
  "Diana",
  "Ethan",
  "Fiona",
  "George",
  "Hannah",
];

const colors = [
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#10b981",
  "#38bdf8",
  "#f97316",
  "#ef4444",
  "#22c55e",
];

export default function Home() {
  const [entries, setEntries] = useState<string[]>(defaultOptions);
  const [name, setName] = useState("");
  const [winner, setWinner] = useState<string | null>(defaultOptions[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const segmentSize = 360 / Math.max(entries.length, 1);

  const wheelGradient = useMemo(() => {
    if (!entries.length) return "transparent";
    const stops = entries
      .map((_, index) => {
        const start = (index / entries.length) * 360;
        const end = ((index + 1) / entries.length) * 360;
        const color = colors[index % colors.length];
        return `${color} ${start}deg ${end}deg`;
      })
      .join(", ");

    return `conic-gradient(${stops})`;
  }, [entries]);

  const handleAddName = () => {
    const clean = name.trim();
    if (!clean || isSpinning) return;

    setEntries((prev) => [...prev, clean]);
    setName("");
    setWinner(null);
  };

  const handleSpin = () => {
    if (isSpinning || !entries.length) return;

    const selectedIndex = Math.floor(Math.random() * entries.length);

    const spins = 7;
    const extraTurn = 360 * spins;
    const targetRotation = rotation + extraTurn - selectedIndex * segmentSize;

    setIsSpinning(true);
    setWinner(null);
    setRotation(targetRotation);

    window.setTimeout(() => {
      setWinner(entries[selectedIndex]);
      setIsSpinning(false);
    }, 6200);
  };

  const handleReset = () => {
    setEntries(defaultOptions);
    setName("");
    setWinner(defaultOptions[0]);
    setRotation(0);
    setIsSpinning(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Lucky Choice
          </p>
          <h1 className="mt-3 text-4xl font-black text-white">Name Spinner</h1>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex justify-center">
            <div className="relative h-[420px] w-[420px]">
              <div
                className="absolute inset-0 rounded-full border-[10px] border-white/10 shadow-[0_0_60px_rgba(34,211,238,0.2)] transition-transform duration-[6200ms] ease-[cubic-bezier(0.12,0.83,0.2,1)]"
                style={{
                  background: wheelGradient,
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                <div className="absolute inset-[38px] rounded-full border border-white/10 bg-slate-950/20" />
              </div>

              {entries.map((entry, index) => {
                const angle = (360 / entries.length) * index - 90;
                const radius = 150;

                return (
                  <div
                    key={`${entry}-${index}`}
                    className="pointer-events-none absolute left-1/2 top-1/2"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px) rotate(${-angle}deg)`,
                    }}
                  >
                    <span
                      className="block max-w-[95px] overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-white/20 bg-slate-950/50 px-2 py-1 text-center text-xs font-semibold text-white shadow-md"
                      title={entry}
                    >
                      {entry}
                    </span>
                  </div>
                );
              })}

              <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
                <div
                  className="h-0 w-0 border-l-[18px] border-r-[18px] border-b-[36px] border-l-transparent border-r-transparent border-b-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                  aria-hidden="true"
                />
              </div>

              <div className="absolute inset-[58px] rounded-full border border-dashed border-white/20" />
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Add a name
              </label>
              <div className="flex gap-2">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Type a name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddName();
                  }}
                  disabled={isSpinning}
                  className="bg-slate-900 text-white placeholder:text-slate-400"
                />
                <Button
                  variant="default"
                  onClick={handleAddName}
                  disabled={!name.trim() || isSpinning}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="mb-2 text-sm font-medium text-slate-200">Current entries</p>
              <div className="flex max-h-52 flex-wrap gap-2 overflow-auto">
                {entries.map((entry, index) => (
                  <span
                    key={`${entry}-${index}`}
                    className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200"
                  >
                    {entry}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-200">Winner</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="border-white/10 bg-slate-900 text-slate-100"
                >
                  Reset
                </Button>
              </div>

              <div className="min-h-[52px] rounded-xl bg-slate-900 p-3 text-lg font-bold text-white">
                {winner ? winner : isSpinning ? "Spinning..." : "Ready to spin"}
              </div>

              <Button
                className="mt-4 w-full"
                size="lg"
                onClick={handleSpin}
                disabled={isSpinning || entries.length < 2}
              >
                {isSpinning ? "Spinning..." : "Spin the wheel"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}