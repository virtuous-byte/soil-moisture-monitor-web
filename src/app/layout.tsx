import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Soil Moisture Monitor",
  description: "Soil Moisture Monitor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <div className="navbar">
          <div className="buton">
            <Link href="/">Sensors</Link>
          </div>
          <div className="buton">
            <Link href="/maps">Moisture Map</Link>
          </div>
          <div className="buton">
            <Link href="/logs">Logs</Link>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
