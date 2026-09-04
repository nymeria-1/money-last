"use client";

import { Card, SectionLabel } from "./Card";
import { NumField } from "./NumField";
import type { Assumptions } from "./Calculator";

export function AssumptionsCard({
  inp,
  setInp,
}: {
  inp: Assumptions;
  setInp: (a: Assumptions) => void;
}) {
  return (
    <Card className="p-5 sm:p-6">
      <SectionLabel>Assumptions</SectionLabel>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <NumField
          label="Starting balance"
          hint="today's dollars"
          value={inp.startBalance}
          onChange={(v) => setInp({ ...inp, startBalance: v })}
          prefix="$"
          step={1000}
        />
        <NumField
          label="Monthly withdrawal"
          hint="indexed to inflation"
          value={inp.monthlyWithdrawal}
          onChange={(v) => setInp({ ...inp, monthlyWithdrawal: v })}
          prefix="$"
          step={100}
        />
        <NumField
          label="Projection horizon"
          hint="how many years to model"
          value={inp.years}
          onChange={(v) => setInp({ ...inp, years: Math.round(v) })}
          suffix={inp.years === 1 ? "yr" : "yrs"}
          step={1}
          min={1}
        />
        <NumField
          label="Average annual return"
          value={inp.annualReturnPct}
          onChange={(v) => setInp({ ...inp, annualReturnPct: v })}
          suffix="%"
          step={0.1}
        />
        <NumField
          label="Average annual inflation"
          value={inp.annualInflationPct}
          onChange={(v) => setInp({ ...inp, annualInflationPct: v })}
          suffix="%"
          step={0.1}
        />
      </div>
    </Card>
  );
}
