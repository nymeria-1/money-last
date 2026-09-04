import { Calculator } from "@/components/Calculator";

export default function Page() {
  return (
    <Calculator
      header={
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-mute">
          Q Wealth · Retirement Calculator
        </p>
      }
    />
  );
}
