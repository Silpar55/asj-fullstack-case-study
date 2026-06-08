import { barlow } from "./fonts";
import "./globals.css";

export const metadata = {
  title: "Case Study",
  description: "Case Study for Ampliwork",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${barlow.className} antialiased`}>{children}</body>
    </html>
  );
}
