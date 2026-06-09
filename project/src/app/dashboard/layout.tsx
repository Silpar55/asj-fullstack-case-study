import Link from "next/link";
import { barlow } from "@/app/fonts";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Case Study Dashboard",
  description: "Dashboard of circuit labs",
};

const links = [
  {
    src: "/stats.svg",
    title: "stats",
    href: "stats",
  },
  {
    src: "/transactions.svg",
    title: "workspace",
    href: "transactions",
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={`${barlow.className} antialiased flex`}>
      <nav className="flex flex-col align-middle justify-between w-20 h-screen py-5 bg-nav border-r border-divider">
        <div className="flex flex-col gap-5">
          <div className="w-full px-1 flex flex-col gap-3">
            <img src="/logo.svg" alt="logo" className="mx-auto" />
            <div className="border-t border-logo-divider" />
          </div>

          {links.map(({ src, title, href }) => (
            <Link
              href={`/dashboard/${href}`}
              key={href}
              className="w-full flex flex-col gap-1"
            >
              <img src={src} alt="link-logo" className="mx-auto" />
              <p className="text-center text-xs font-bold text-link capitalize">
                {title}
              </p>
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          <div className="w-full flex flex-col gap-1">
            <img src="/settings.svg" alt="link-logo" className="mx-auto" />
          </div>
          <div className="w-full flex flex-col gap-1">
            <img src="/profile.svg" alt="link-logo" className="mx-auto" />
          </div>
        </div>
      </nav>
      {children}
    </main>
  );
}
