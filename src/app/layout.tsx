import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const tiempos = localFont({
  src: [
    { path: "./fonts/TiemposHeadline-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/TiemposHeadline-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-tiempos",
  display: "swap",
});

export const metadata: Metadata = {
  title: "How Long Will My Money Last",
  description:
    "Q Wealth is commissioning a small web application, How Long Will My Money Last, that estimates how long a person's savings will last when drawn down by regular, inflation-indexed withdrawals — accounting for compound investment growth, inflation, and any one-off lump sums.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${tiempos.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
