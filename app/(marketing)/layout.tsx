import type { Metadata, Viewport } from "next";
import SiteScripts from "@/components/SiteScripts";

export const metadata: Metadata = {
  title: {
    absolute: "Aureus Technologies | Software & Web Development",
  },
  description:
    "Aureus Technologies provides modern website development, custom software solutions, mobile applications and digital services.",
};

export const viewport: Viewport = {
  themeColor: "#080a0d",
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <SiteScripts />
    </>
  );
}
