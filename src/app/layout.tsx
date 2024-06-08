import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Strategy Dot Zero| Welcome to the future of strategy execution",
  description:
    "Transform Your Strategy Execution with StrategyDotZero | The Leading Solution for Enterprises & Governments ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Toaster />
        <Navbar />
        <div className="p-4">{children}</div>
      </body>
    </html>
  );
}
