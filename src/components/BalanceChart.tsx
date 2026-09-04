"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Row } from "@/lib/calc";
import { AUD, compact } from "@/lib/format";

const axisTick = { fontSize: 11, fill: "var(--mute)" } as const;
const axisLine = { stroke: "var(--line)" } as const;

const tooltipStyle = {
  fontSize: 12,
  borderRadius: 12,
  background: "var(--surface)",
  border: "1px solid var(--line)",
  color: "var(--ink)",
};

const legendStyle = { fontSize: 11, paddingBottom: 8 };

export function BalanceChart({
  rows,
  depletionYear,
}: {
  rows: Row[];
  depletionYear: number | null;
}) {
  const data = rows.map((r) => ({
    year: r.year,
    nominal: Math.max(0, r.start),
    real: Math.max(0, r.todayValue),
  }));
  const label =
    depletionYear !== null
      ? `Projected balance and its value in today's dollars over ${rows.length - 1} years; depleted in year ${depletionYear}.`
      : `Projected balance and its value in today's dollars over ${rows.length - 1} years; survives the projection.`;

  return (
    <div role="img" aria-label={label}>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <defs>
            <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.45} />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
          <XAxis dataKey="year" tick={axisTick} axisLine={axisLine} tickLine={axisLine} />
          <YAxis
            tickFormatter={compact}
            tick={axisTick}
            axisLine={axisLine}
            tickLine={axisLine}
            width={64}
          />
          <Tooltip
            formatter={(v) => AUD(Number(v))}
            labelFormatter={(y) => `Year ${y}`}
            contentStyle={tooltipStyle}
            cursor={{ stroke: "var(--line)", strokeWidth: 1, strokeDasharray: "3 3" }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="plainline"
            wrapperStyle={legendStyle}
          />
          <Area
            type="monotone"
            dataKey="nominal"
            name="Balance at year start"
            stroke="var(--brand)"
            strokeWidth={2}
            fill="url(#balanceFill)"
          />
          <Line
            type="monotone"
            dataKey="real"
            name="Today's $ value"
            stroke="var(--ink)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
          />
          {depletionYear !== null && (
            <ReferenceLine
              x={depletionYear}
              stroke="var(--warn)"
              strokeDasharray="4 4"
              label={{
                value: `depleted · yr ${depletionYear}`,
                fontSize: 11,
                fill: "var(--warn)",
                position: "insideTopRight",
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
