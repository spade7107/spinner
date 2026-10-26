"use client";

import { useMemo, useState } from "react";
import { RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [entries, setEntries] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const segmentSize = entries.length ? 360 / entries.length : 0;
  const labelRadius = entries.length === 1
    ? 0
    : Math.min(138, Math.max(76, 165 - entries.length * 4));

  const wheelGradient = useMemo(() => {
    if (!entries.length) return "transparent";
    const stops = entries
      .map((_, index) => {
        const start = index * segmentSize;
        const end = (index + 1) * segmentSize;
        const color = colors[index % colors.length];
        return `${color} ${start}deg ${end}deg`;
      })
      .join(", ");

    return `conic-gradient(${stops})`;
  }, [entries, segmentSize]);

  const handleAddName = () => {
    const clean = name.trim();
    if (!clean || isSpinning) return;

    setEntries((prev) => [...prev, clean]);
    setName("");
    setWinner(null);
  };

  const handleSpin = () => {
    if (isSpinning || entries.length < 2) return;

    const selectedIndex = Math.floor(Math.random() * entries.length);

    const spins = 7;
    const currentOffset = ((rotation % 360) + 360) % 360;
    const selectedAngle = (selectedIndex + 0.5) * segmentSize;
    const alignment = (360 - ((selectedAngle + currentOffset) % 360)) % 360;
    const targetRotation = rotation + 360 * spins + alignment;

    setIsSpinning(true);
    setWinner(null);
    setRotation(targetRotation);

    window.setTimeout(() => {
      setWinner(entries[selectedIndex]);
      setIsSpinning(false);
    }, 6200);
  };

  const handleReset = () => {
    setEntries([]);
    setName("");
    setWinner(null);
    setRotation(0);
    setIsSpinning(false);
  };

  const handleRemoveName = (indexToRemove: number) => {
    if (isSpinning) return;

    const removedName = entries[indexToRemove];
    const remainingEntries = entries.filter((_, index) => index !== indexToRemove);

    setEntries(remainingEntries);
    setWinner((currentWinner) =>
      currentWinner === removedName && !remainingEntries.includes(removedName)
        ? null
        : currentWinner
    );
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
            <div className="relative aspect-square w-full max-w-[420px]">
              <div
                role="button"
                tabIndex={0}
                aria-label={isSpinning ? "Wheel is spinning" : entries.length < 2 ? "Add at least two names to spin" : "Spin the wheel"}
                aria-disabled={isSpinning || entries.length < 2}
                onClick={handleSpin}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleSpin();
                  }
                }}
                className={`absolute inset-0 rounded-full border-[10px] border-slate-950 shadow-[0_0_60px_rgba(34,211,238,0.2)] transition-transform duration-[6200ms] ease-[cubic-bezier(0.12,0.83,0.2,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950 ${isSpinning || entries.length < 2 ? "cursor-not-allowed" : "cursor-pointer"}`}
                style={{
                  background: entries.length
                    ? wheelGradient
                    : "radial-gradient(circle, rgba(15, 23, 42, 0.96), rgba(2, 6, 23, 0.96))",
                  backgroundClip: "padding-box",
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                {entries.map((entry, index) => {
                  const angle = segmentSize * (index + 0.5);

                  return (
                    <div
                      key={`${entry}-${index}`}
                      className="pointer-events-none absolute left-1/2 top-1/2"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${labelRadius}px) rotate(${-angle - rotation}deg)`,
                      }}
                    >
                      <span
                        className="block max-w-[104px] overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-white/25 bg-slate-950/55 px-2 py-1 text-center font-semibold text-white shadow-md"
                        style={{ fontSize: entries.length > 8 ? "10px" : "12px" }}
                        title={entry}
                      >
                        {entry}
                      </span>
                    </div>
                  );
                })}

                {!entries.length && (
                  <div className="absolute inset-0 grid place-items-center px-8 text-center text-sm font-medium text-slate-400">
                    Add a name to create your first slice
                  </div>
                )}
              </div>

              <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
                <div
                  className="h-0 w-0 border-l-[18px] border-r-[18px] border-b-[36px] border-l-transparent border-r-transparent border-b-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                  aria-hidden="true"
                />
              </div>

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
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-200">
                  Current entries ({entries.length})
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={isSpinning}
                  className="border-white/10 bg-slate-900 text-slate-100"
                >
                  <RotateCcw aria-hidden="true" />
                  Reset
                </Button>
              </div>
              <div className="flex max-h-52 flex-wrap gap-2 overflow-auto">
                {entries.length ? (
                  entries.map((entry, index) => (
                    <span
                      key={`${entry}-${index}`}
                      className="inline-flex items-center gap-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 py-1 pl-3 pr-1 text-sm text-cyan-200"
                    >
                      {entry}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${entry}`}
                        title={`Remove ${entry}`}
                        onClick={() => handleRemoveName(index)}
                        disabled={isSpinning}
                        className="h-7 w-7 rounded-full p-0 text-cyan-200 hover:bg-cyan-400/20 hover:text-white"
                      >
                        <X aria-hidden="true" />
                      </Button>
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No names added yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="mb-2 text-sm font-medium text-slate-200">Winner</p>

              <div className="min-h-[52px] rounded-xl bg-slate-900 p-3 text-lg font-bold text-white">
                {winner
                  ? winner
                  : isSpinning
                    ? "Spinning..."
                    : entries.length < 2
                      ? "Add at least two names to spin"
                      : "Click or tap the wheel to spin"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}