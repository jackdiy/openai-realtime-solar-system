import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "@/components/enhanced-styles.css";

export const metadata: Metadata = {
  title: "太阳系探索器 - Solar System Explorer",
  description: "语音与手势交互式3D太阳系 - Voice & Gesture Interactive 3D Solar System",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* Google Fonts - Inter and Roboto */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        {/* Tone.js for audio */}
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
