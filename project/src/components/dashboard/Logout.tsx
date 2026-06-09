"use client";
import { useRouter } from "next/navigation";
import { clearUser } from "@/lib/api/auth";

export default function Logout() {
  const router = useRouter();
  const logout = () => {
    clearUser();

    router.push("/login");
  };
  return (
    <button onClick={() => logout()} className="w-full flex flex-col gap-1">
      <img
        src="/logout.svg"
        alt="link-logo"
        className="mx-auto w-8 text-center"
      />
    </button>
  );
}
