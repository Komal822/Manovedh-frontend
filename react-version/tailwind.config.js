/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { ink: '#0c2a26', leaf: '#24504a', mint: '#dcf0dc', line: '#cfe8d5', tint: '#eef7ef' },
    fontFamily: { sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'] },
  } },
  plugins: [],
};
