export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#141414',
        secondary: '#1f1f1f',
        tertiary: '#2a2a2a',
        text: {
          primary: '#ffffff',
          secondary: '#b3b3b3',
        },
        red: {
          DEFAULT: '#e50914',
          hover: '#b20710',
        },
        blue: '#0071eb',
        success: '#46d369',
        error: '#e50914',
      },
    },
  },
  plugins: [],
}
