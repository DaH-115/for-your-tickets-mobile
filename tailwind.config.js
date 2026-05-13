/** @type {import('tailwindcss').Config} */
module.exports = {
  // 웹에서 NativeWind / css-interop가 colorScheme을 다루려면 class 모드 필요 (media면 런타임 오류)
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#8b1e3f",
        accent: "#a6892b",
        background: "#121212",
        surface: "#1a1a1a",
        "surface-light": "#2a2a2a",
        "text-primary": "#ffffff",
        "text-secondary": "#aaaaaa",
        "text-muted": "#888888",
      },
    },
  },
  plugins: [],
};
