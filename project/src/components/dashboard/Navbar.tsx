"use client";
import Link from "next/link";
import Logout from "@/components/dashboard/Logout";
import { useEffect, useState } from "react";
import { UserLS } from "@/interfaces/auth/userLS";
import { getUser } from "@/lib/api/auth";
import router from "next/router";
import { hasAccess } from "@/lib/api/rabc";

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

const Navbar = () => {
  // Handling tabs allowed or not
  const [user, setUser] = useState<UserLS | null>(null);
  const [loading, isLoading] = useState<Boolean>(true);

  useEffect(() => {
    const user: UserLS = getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setUser(user);

    isLoading(false);
  }, [router]);

  return (
    <nav className="fixed left-0 top-0 flex flex-col align-middle justify-between w-20 min-h-screen  py-5 bg-nav border-r border-divider">
      <div className="flex flex-col gap-5">
        <div className="w-full px-1 flex flex-col gap-3">
          <img src="/logo.svg" alt="logo" className="mx-auto" />
          <div className="border-t border-logo-divider" />
        </div>

        {!loading &&
          links.map(
            ({ src, title, href }) =>
              hasAccess(
                user as UserLS,
                href as "stats" | "transactions" | "custom",
              ) && (
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
              ),
          )}
      </div>

      <div className="flex flex-col gap-5">
        <Logout />
        <div className="w-full flex flex-col gap-1">
          <img src="/settings.svg" alt="link-logo" className="mx-auto" />
        </div>
        <div className="w-full flex flex-col gap-1">
          <img src="/profile.svg" alt="link-logo" className="mx-auto" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
