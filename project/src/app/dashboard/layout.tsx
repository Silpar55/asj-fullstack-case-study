import { barlow } from "../fonts";

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
    <html lang="en">
      <body className={`${barlow.className} antialiased flex`}>
        <nav className="py-5 gap-5 flex flex-col align-middle w-20 h-screen bg-nav border-r border-divider">
          <div className="w-full px-1 flex flex-col gap-3">
            <img src="logo.svg" alt="logo" className="mx-auto" />
            <div className="border-t border-logo-divider" />
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
