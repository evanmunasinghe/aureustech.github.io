import "./app.css";
import { DataProvider } from "@/lib/store/store-context";
import { AuthGate } from "@/components/app/AuthGate";

export const metadata = {
  title: "Aureus PM Suite",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DataProvider>
      <AuthGate>{children}</AuthGate>
    </DataProvider>
  );
}
