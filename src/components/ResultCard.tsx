import type { Row } from "@/lib/calc";
import { AnimatedAmount } from "./AnimatedAmount";
import { Card, SectionLabel } from "./Card";

export function ResultCard({
  depletionRow,
  lastRow,
  finalTodayValue,
  years,
}: {
  depletionRow: Row | null;
  lastRow: Row;
  finalTodayValue: number;
  years: number;
}) {
  return (
    <Card className="p-6 sm:p-8">
      <SectionLabel>Result</SectionLabel>
      {depletionRow ? (
        <>
          <p className="mt-3 font-display text-4xl font-normal leading-[1.05] tracking-tight sm:text-5xl">
            Your money runs out in{" "}
            <span key={depletionRow.year} className="value-tick text-brand">
              Year {depletionRow.year}
            </span>
            <span className="text-brand pl-1">.</span>
          </p>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-mute sm:text-base">
            You start year {depletionRow.year} with{" "}
            <strong className="text-ink">
              <AnimatedAmount value={depletionRow.start} />
            </strong>{" "}
            in the account, which is{" "}
            <strong className="text-ink">
              <AnimatedAmount value={depletionRow.todayValue} />
            </strong>{" "}
            in today&rsquo;s dollars. Withdrawing{" "}
            <strong className="text-ink">
              <AnimatedAmount value={depletionRow.regular} />
            </strong>{" "}
            across that year (indexed to inflation) is what empties it.
          </p>
        </>
      ) : (
        <>
          <p className="mt-3 font-display text-4xl font-normal leading-[1.05] tracking-tight sm:text-5xl">
            Your money lasts beyond{" "}
            <span className="text-brand">year {years}</span>
            <span className="text-brand">.</span>
          </p>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-mute sm:text-base">
            After {years} {years === 1 ? "year" : "years"} you&rsquo;re left with{" "}
            <strong className="text-ink">
              <AnimatedAmount value={lastRow.end} digits={2} />
            </strong>{" "}
            in the account. That&rsquo;s{" "}
            <strong className="text-ink">
              <AnimatedAmount value={finalTodayValue} />
            </strong>{" "}
            in today&rsquo;s dollars.
          </p>
        </>
      )}
    </Card>
  );
}
