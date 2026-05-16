import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YOO Quote Builder",
  description: "Internal quotation builder for YOO Plastic Surgery and Aesthetics Clinic"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
