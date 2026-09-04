import type { Row } from "@/lib/calc";
import { AUD } from "@/lib/format";
import { Card, SectionLabel } from "./Card";

const EmptyCell = () => <span className="text-mute/40">·</span>;

export function DrawdownTable({
  rows,
  depletionYear,
}: {
  rows: Row[];
  depletionYear: number | null;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-line px-5 py-4 sm:px-6">
        <SectionLabel>Year-by-year drawdown</SectionLabel>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-right text-sm tabular-nums">
          <thead className="text-xs uppercase tracking-wider text-mute">
            <tr>
              <th className="px-4 py-3 text-left font-medium sm:px-5">Year</th>
              <th className="px-4 py-3 font-medium sm:px-5">Opening balance</th>
              <th className="px-4 py-3 font-medium sm:px-5">Today&rsquo;s $ value</th>
              <th className="px-4 py-3 font-medium sm:px-5">Regular</th>
              <th className="px-4 py-3 font-medium sm:px-5">Lump-sum out</th>
              <th className="px-4 py-3 font-medium sm:px-5">Windfall</th>
              <th className="px-4 py-3 font-medium sm:px-5">Closing balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.year}
                className={`border-t border-line/60 transition-colors duration-300 ${
                  r.year === depletionYear ? "bg-warn/10" : ""
                }`}
              >
                <td className="px-4 py-2 text-left font-medium sm:px-5">{r.year}</td>
                <td className="px-4 py-2 sm:px-5">{AUD(r.start)}</td>
                <td className="px-4 py-2 text-mute sm:px-5">{AUD(r.todayValue)}</td>
                <td className="px-4 py-2 sm:px-5">{AUD(r.regular)}</td>
                <td className="px-4 py-2 sm:px-5">
                  {r.lumpOut ? AUD(r.lumpOut) : <EmptyCell />}
                </td>
                <td className="px-4 py-2 sm:px-5">
                  {r.windfall ? AUD(r.windfall) : <EmptyCell />}
                </td>
                <td
                  className={`px-4 py-2 font-medium sm:px-5 ${r.end < 0 ? "text-danger" : "text-ink"}`}
                >
                  {AUD(r.end, 2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
