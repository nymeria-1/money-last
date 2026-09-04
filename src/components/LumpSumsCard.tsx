"use client";

import { useState } from "react";
import type { Lump } from "@/lib/calc";
import { Card, SectionLabel } from "./Card";
import { MiniNum } from "./NumField";

export function LumpSumsCard({
  lumps,
  setLump,
}: {
  lumps: Lump[];
  setLump: (year: number, key: keyof Lump, value: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="lump-sums-panel"
        onClick={() => setExpanded((s) => !s)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/[0.02] sm:px-6"
      >
        <div>
          <SectionLabel>One-off lump sums</SectionLabel>
          <p className="mt-1 text-sm text-mute">
            Add a windfall or an extra withdrawal for a specific year.
          </p>
        </div>
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-full border border-line text-mute transition ${expanded ? "rotate-45" : ""}`}
          aria-hidden
        >
          +
        </span>
      </button>
      {expanded && (
        <div id="lump-sums-panel" className="max-h-96 overflow-auto border-t border-line">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-surface text-left text-xs uppercase tracking-wider text-mute">
              <tr>
                <th className="px-5 py-3 font-medium sm:px-6">End of year</th>
                <th className="px-5 py-3 font-medium sm:px-6">Withdrawal</th>
                <th className="px-5 py-3 font-medium sm:px-6">Windfall</th>
              </tr>
            </thead>
            <tbody>
              {/* Excel uses 1-indexed "End Year N" labels: N maps to drawdown row (N-1). */}
              {lumps.slice(0, -1).map((l, y) => (
                <tr key={y} className="border-t border-line/60">
                  <td className="px-5 py-2 text-mute sm:px-6">{y + 1}</td>
                  <td className="px-5 py-2 sm:px-6">
                    <MiniNum value={l.withdrawal} onChange={(v) => setLump(y, "withdrawal", v)} />
                  </td>
                  <td className="px-5 py-2 sm:px-6">
                    <MiniNum value={l.windfall} onChange={(v) => setLump(y, "windfall", v)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
