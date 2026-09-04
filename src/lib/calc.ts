export type Lump = { withdrawal: number; windfall: number };

export type Inputs = {
  startBalance: number;
  annualReturn: number;
  annualInflation: number;
  monthlyWithdrawal: number;
  years: number;
  lumps: Lump[];
};

export type Row = {
  year: number;
  start: number;
  todayValue: number;
  regular: number;
  lumpOut: number;
  windfall: number;
  end: number;
};

export type Result = {
  rows: Row[];
  depletionYear: number | null;
};

// Reproduces the supplied Excel model, year by year:
//   end = start * (1+rm)^12 - (regular/12) * ((1+rm)^12 - 1)/rm - lumpOut + windfall
// which is Excel's FV(rm, 12, regular/12, -start), then apply lump sums.
// Once end < 0, subsequent years zero out (mirrors the sheet's IF(prevEnd<0, 0, ...)).
export function project(i: Inputs): Result {
  const rm = Math.pow(1 + i.annualReturn, 1 / 12) - 1;
  const growth = Math.pow(1 + rm, 12);
  const annuity = rm === 0 ? 12 : (growth - 1) / rm;

  const rows: Row[] = [];
  let depletionYear: number | null = null;
  let start = i.startBalance;
  let regular = i.monthlyWithdrawal * 12;

  for (let y = 0; y <= i.years; y++) {
    const { withdrawal: lumpOut, windfall } = i.lumps[y] ?? { withdrawal: 0, windfall: 0 };
    const end = start * growth - (regular / 12) * annuity - lumpOut + windfall;
    const todayValue = start / Math.pow(1 + i.annualInflation, y);

    rows.push({ year: y, start, todayValue, regular, lumpOut, windfall, end });

    if (end < 0 && depletionYear === null) depletionYear = y;

    const nextStart = end < 0 ? 0 : end;
    regular = nextStart > 0 ? regular * (1 + i.annualInflation) : 0;
    start = nextStart;
  }

  return { rows, depletionYear };
}
