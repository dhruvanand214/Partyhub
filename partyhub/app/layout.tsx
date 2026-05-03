import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cheers India 🍸",
  description: "Plan. Party. Perfect. India's smartest party planning app.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0D0A1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0D0A1A] text-white antialiased overflow-x-hidden">
        <div className="mx-auto max-w-[430px] min-h-screen relative">
          {children}
        </div>
      </body>
    </html>
  );
}