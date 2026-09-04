"use client";

import { useMemo, useState, type ReactNode } from "react";
import { project, type Lump } from "@/lib/calc";
import { AssumptionsCard } from "./AssumptionsCard";
import { BalanceChart } from "./BalanceChart";
import { Card, SectionLabel } from "./Card";
import { DrawdownTable } from "./DrawdownTable";
import { LumpSumsCard } from "./LumpSumsCard";
import { ResultCard } from "./ResultCard";

export type Assumptions = {
  startBalance: number;
  annualReturnPct: number;
  annualInflationPct: number;
  monthlyWithdrawal: number;
  years: number;
};

// Reference scenario from the supplied Excel — depletes in year 21.
const DEFAULTS: Assumptions = {
  startBalance: 1_650_000,
  annualReturnPct: 7.5,
  annualInflationPct: 3,
  monthlyWithdrawal: 10_000,
  years: 50,
};

const emptyLump: Lump = { withdrawal: 0, windfall: 0 };

const seedLumps = (n: number): Lump[] => {
  const l = Array.from({ length: n }, () => ({ ...emptyLump }));
  if (l[1]) l[1].windfall = 1500;
  if (l[5]) l[5].windfall = 1000;
  if (l[9]) l[9].windfall = 1000;
  return l;
};

export function Calculator({ header }: { header?: ReactNode }) {
  const [inp, setInp] = useState<Assumptions>(DEFAULTS);
  const [lumps, setLumps] = useState<Lump[]>(() => seedLumps(DEFAULTS.years + 1));

  // Keep the lumps array the same length as the projection so any year is editable.
  const lumpsSafe = useMemo(() => {
    const need = inp.years + 1;
    if (lumps.length >= need) return lumps.slice(0, need);
    return [...lumps, ...Array.from({ length: need - lumps.length }, () => ({ ...emptyLump }))];
  }, [lumps, inp.years]);

  const result = useMemo(
    () =>
      project({
        startBalance: Math.max(0, inp.startBalance),
        // Clamp above -100% so (1+r)^(1/12) never evaluates to NaN.
        annualReturn: Math.max(-0.99, inp.annualReturnPct / 100),
        annualInflation: Math.max(-0.99, inp.annualInflationPct / 100),
        monthlyWithdrawal: Math.max(0, inp.monthlyWithdrawal),
        years: Math.max(1, Math.min(80, inp.years)),
        lumps: lumpsSafe,
      }),
    [inp, lumpsSafe],
  );

  const setLump = (y: number, k: keyof Lump, v: number) => {
    setLumps((prev) => {
      const next = prev.slice();
      while (next.length < y + 1) next.push({ ...emptyLump });
      next[y] = { ...next[y], [k]: Math.max(0, v) };
      return next;
    });
  };

  const depletionRow =
    result.depletionYear !== null ? result.rows[result.depletionYear] : null;
  const lastRow = result.rows.at(-1)!;
  const finalTodayValue =
    lastRow.end / Math.pow(1 + inp.annualInflationPct / 100, inp.years);

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {header}

      <header className="mt-6 sm:mt-8">
        <h1 className="font-display text-4xl font-normal leading-[1.05] tracking-tight sm:text-5xl lg:text-[64px]">
          How Long Will My Money Last<span className="text-brand pl-2">.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mute sm:text-base">
          See how long your savings last while you draw a monthly income that
          keeps up with inflation, with room to add one-off withdrawals or
          windfalls along the way.
        </p>
      </header>

      <div className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-[minmax(300px,340px)_1fr] lg:gap-8">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <AssumptionsCard inp={inp} setInp={setInp} />
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          <ResultCard
            depletionRow={depletionRow}
            lastRow={lastRow}
            finalTodayValue={finalTodayValue}
            years={inp.years}
          />

          <Card className="p-5 sm:p-6">
            <SectionLabel>Projected balance</SectionLabel>
            <div className="mt-4">
              <BalanceChart rows={result.rows} depletionYear={result.depletionYear} />
            </div>
          </Card>

          <LumpSumsCard lumps={lumpsSafe} setLump={setLump} />

          <DrawdownTable rows={result.rows} depletionYear={result.depletionYear} />
        </div>
      </div>

      <footer className="mt-10 text-xs leading-relaxed text-mute/80">
        <p>
          © The information contained on this financial health check tool is
          general in nature and may not fully represent your entire personal
          and/or financial situation. The financial goals calculator used in
          this scenario builder assumes a {inp.annualReturnPct.toFixed(2)}%
          rate of return and an inflation rate of{" "}
          {inp.annualInflationPct.toFixed(2)}% over the long term. Any
          conclusions based on the information are projective in nature and do
          not provide a guaranteed outcome. For further information regarding
          the information contained in this scenario builder, please refer to
          your financial planner.
        </p>
      </footer>
    </main>
  );
}
