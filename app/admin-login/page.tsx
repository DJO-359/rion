"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });
    console.log("ENV:", process.env.ADMIN_SECRET);
    console.log("PASSWORD:", password);

    if (res.ok) {
      window.location.href = "/admin";
    } else {
      alert("Неверный пароль");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07111f] text-white">
      <div className="w-[400px] rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold">Admin Login</h1>

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-5 w-full rounded-xl bg-black/30 p-3 outline-none"
        />

        <button
          onClick={handleLogin}
          className="mt-4 w-full rounded-xl bg-[#C89B5E] py-3 font-medium text-black"
        >
          Войти
        </button>
      </div>
    </div>
  );
}
