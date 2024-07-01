import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import {
  Roboto,
  Sora,
  Poppins,
  Rubik,
  Inter,
  Urbanist,
  Cabin_Sketch,
} from "next/font/google";
import type { Viewport } from "next";

const robotoFont = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

const urbanistFont = Urbanist({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-urbanist",
});

const soraFont = Sora({
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-sora",
  subsets: ["latin"],
});

const poppinsFont = Poppins({
  weight: ["200", "400", "500", "600", "800"],
  display: "swap",
  variable: "--font-poppins",
  subsets: ["latin"],
});

const rubikFont = Rubik({
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-rubik",
  subsets: ["latin"],
});
const CabinSketch = Cabin_Sketch({
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-cabinsketch",
  subsets: ["latin"],
});

const interFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const keywords = [
  // Brand-specific keywords
  "Tosto restaurant marketing platform",
  "Tosto feedback referral system",
  "Tosto customer loyalty  solution",
  // Industry-specific keywords
  "Restaurant marketing solutions",
  "Restaurant feedback management system",
  // Feature-specific keywords
  "Digital marketing for restaurants",
  "Online reputation management for dining establishments",
  "Customer loyalty programs for cafes and restaurants",
  // Service-related keywords
  "Restaurant feedback aggregator",
  "Customer referral program for dining venues",
  "Restaurant survey tool for feedback analysis",
  //location
  "Restaurant marketing solutions in India",
  "Customer loyalty  platform for restaurants in India",
  "How to improve restaurant feedback",
  "Why use WhatsApp for restaurant marketing",
  "What are the benefits of digital menu integration?",
  "How can restaurants enhance customer loyalty?",
  "When is the best time to run marketing campaigns for restaurants?",

  // Technology-specific keywords
  "WhatsApp-integrated restaurant solutions",
  "Digital menu integration for dining experience",
  // Trending keywords
  "WhatsApp solutions for restaurant growth",
  "Revolutionizing restaurant marketing with WhatsApp",
  // Generic keywords
  "Dining experience enhancement",
  "Restaurant promotion tools",
  "Marketing analytics for restaurants",
  // Competitor comparison keywords (if applicable)
  "Tosto vs Reelo",
  // Long-tail keywords
  "Effective restaurant marketing strategies",
  "Innovative customer feedback management",
  "Enhancing customer satisfaction in restaurants",
];

const keywordContent = keywords.length > 0 ? keywords.join(", ") : "";

export const metadata = {
  title: "Tosto - Elevating Restaurant Growth with WhatsApp Solutions",
  description:
    "Tosto.in revolutionizes restaurant growth through WhatsApp-integrated solutions for feedback management, referral programs, and targeted marketing campaigns.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVariables = `${interFont.variable} ${robotoFont.variable} ${soraFont.variable} ${poppinsFont.variable} ${rubikFont.variable} ${urbanistFont.variable} ${CabinSketch.variable}`;

  return (
    <html lang="en" className={fontVariables}>
      <head>
        <meta name="keywords" content={keywordContent} />
        <meta name="robots" content="all" />
        <meta name="googlebot" content="index,follow" />
        <meta name="description" content={metadata.description} />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="msapplication-starturl" content="/" />
        <meta name="application-name" content={metadata.title} />
        <meta name="apple-mobile-web-app-title" content={metadata.title} />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:site_name" content={metadata.title} />
        <meta property="og:image" content="/logo-icon.png" />
        <meta property="og:image:secure_url" content="/logo-icon.png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <link rel="apple-touch-icon" href="/logo-icon.png" />
        <link rel="icon" type="image/png" href="/logo-icon.png" />
        <link rel="shortcut icon" href="/logo-icon.png" />
        <meta property="og:url" content="https://tosto.in" />
        <meta name="google" content="notranslate" key="notranslate" />
      </head>
      <body>
        <Providers>{children} </Providers>
      </body>
    </html>
  );
}
