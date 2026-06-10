import { barlow } from "@/app/fonts";
import Navbar from "@/components/dashboard/Navbar";

export const metadata = {
  title: "Case Study Dashboard",
  description: "Dashboard of circuit labs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={`${barlow.className} antialiased flex`}>
      <Navbar />
      {children}
    </main>
  );
}
