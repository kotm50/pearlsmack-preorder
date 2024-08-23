/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        skyblue: "#3b82f6",
        skybluehover: "#0070ff",
        redorange: "#ff7139",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 200ms ease-in-out",
      },
      fontFamily: {
        neo: ['"NanumSquareNeo"'],
        neolight: ['"NanumSquareNeoLight"'],
        neobold: ['"NanumSquareNeoBold"'],
        neoextra: ['"NanumSquareNeoExtraBold"'],
        neoheavy: ['"NanumSquareNeoHeavy"'],
      },
    },
  },
  plugins: [],
};
