"use client";

import React, { useEffect, useState } from "react";

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
];

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("kanban-theme") || "light";
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("kanban-theme", theme);
  };

  return (
    <div className="dropdown dropdown-end">
      <button
        tabIndex={0}
        role="button"
        className="btn btn-ghost m-1 border border-base-300 shadow-sm normal-case bg-base-100/30 backdrop-blur-md hover:bg-base-200/50 transition-all rounded-2xl gap-2"
      >
        <span className="text-sm font-extrabold tracking-tight">
          Theme:{" "}
          <span className="capitalize text-primary ml-1 underline decoration-primary/30 underline-offset-4">
            {currentTheme}
          </span>
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 opacity-40"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <ul
        tabIndex={0}
        className="dropdown-content z-[100] p-3 shadow-2xl bg-base-100/95 backdrop-blur-xl rounded-3xl w-64 max-h-96 overflow-y-auto border border-base-300 mt-2 scrollbar-hide"
      >
        <li className="px-4 py-3 mb-2 border-b border-base-200">
          <span className="text-[10px] font-base-content uppercase tracking-[0.3em] opacity-40">
            Select Visual Identity
          </span>
        </li>
        {themes.map((theme) => (
          <li key={theme} className="mb-1 last:mb-0">
            <button
              onClick={() => handleThemeChange(theme)}
              className={`btn btn-sm btn-ghost w-full normal-case p-0 overflow-hidden h-auto rounded-xl transition-all ${currentTheme === theme ? "bg-primary/10 text-primary" : "hover:bg-base-200"}`}
            >
              <div className="flex w-full items-center justify-between gap-4">
                <div
                  data-theme={theme}
                  className="flex gap-0.5 p-1 rounded-lg bg-base-100 border border-base-content/5 shadow-inner"
                >
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <div className="w-3 h-3 rounded-full bg-accent" />
                </div>
                <span
                  className={`text-sm capitalize ${currentTheme === theme ? "font-black" : "font-bold opacity-70"}`}
                >
                  {theme}
                </span>
              </div>
              {currentTheme === theme && (
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--p)]" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
