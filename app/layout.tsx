import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Milk Money",
    template: "%s | Milk Money",
  },
  description:
    "Milk Money is a modern grocery planner and price calculator that helps you track item prices, manage your shopping list, and control your budget.",
  applicationName: "Milk Money",
  keywords: [
    "grocery planner",
    "shopping list",
    "budget tracker",
    "price calculator",
    "grocery app",
  ],
  authors: [{ name: "Milk Money" }],
  creator: "Milk Money",
  metadataBase: new URL("https://milkmoney.app"), // update when live
  openGraph: {
    title: "Milk Money",
    description:
      "Track grocery prices, plan smarter shopping trips, and stay within budget.",
    url: "https://milkmoney.app",
    siteName: "Milk Money",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Milk Money",
    description:
      "Track grocery prices, plan smarter shopping trips, and stay within budget.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="min-h-dvh bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}