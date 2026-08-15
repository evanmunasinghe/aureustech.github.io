import type { Metadata, Viewport } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "./globals.css";
import SiteScripts from "@/components/SiteScripts";

export const metadata: Metadata = {
  title: "Aureus Technologies | Software & Web Development",
  description:
    "Aureus Technologies provides modern website development, custom software solutions, mobile applications and digital services.",
  icons: {
    icon: "/images/aureus-technologies-logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#080a0d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <SiteScripts />
      </body>
    </html>
  );
}
