import type { Metadata } from "next";
import { Bodoni_Moda, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Montaire | Fine Jewelry, Made Yours",
  description:
    "Montaire — bespoke fine jewelry designed around your story, your moment, your vision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodoni.variable} ${outfit.variable}`}>
      <body
        className="antialiased"
        style={{
          background: "var(--montaire-black)",
          color: "var(--montaire-white)",
        }}
      >
        <SmoothScroll>
          <CustomCursor />
          <Navigation />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
