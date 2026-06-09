"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearUser } from "@/lib/api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const userData = await res.json();

      localStorage.setItem("user", JSON.stringify(userData));

      router.push("/dashboard/transactions");
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
    }
  };

  return (
    <main className="w-full h-screen flex flex-col justify-center items-center">
      <form className="flex flex-col gap-5 w-80" onSubmit={handleLogin}>
        {error && (
          <h1 className="text-red-500 text-2xl  text-center uppercase">
            {error}
          </h1>
        )}
        <h1 className="text-white text-4xl  text-center uppercase">
          Welcome Back!
        </h1>

        <div className="flex gap-2 border border-white p-2 ">
          <img src="user.svg" alt="user" className="text-sm" />
          <input
            type="text"
            placeholder="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent placeholder:uppercase placeholder:text-white placeholder:text-sm text-white focus:outline-none"
            required
          />
        </div>

        <div className="flex gap-2 border border-white p-2 ">
          <img src="lock.svg" alt="user" className="text-sm" />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent placeholder:uppercase placeholder:text-white placeholder:text-sm text-white focus:outline-none"
            required
          />
        </div>

        <div className="w-full">
          <button className="border rounded p-2 w-full bg-white uppercase text-blue-600 font-semibold">
            Login
          </button>
          <p className="text-white font-medium text-right mt-1">
            Forgot password?
          </p>
        </div>
      </form>
    </main>
  );
}
