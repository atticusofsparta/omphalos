/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'selector', // or 'media' or 'class'
  theme: {
    duration: {
      fast: '1s',
      normal: '3s',
      slow: '5s',
    },
    extend: {
      backgroundImage: {
        'cyber-garden': "url('./images/flow-punk.webp')",
      },
      text: {
        // TODO: add typography tokens
        base: '14px',
        scale: 1.2,
      },
      fontFamily: {
        sans: ['Kode Mono Variable', 'monospace'],
      },
      boxShadow: {
        one: '0px 0px 0px 16px rgba(14, 14, 15, 0.70)',
        primary: '0px 0px 10px 6px rgba(255, 42, 109, 0.70)',
        primaryThin: '0px 0px 15px 5px rgba(255, 42, 109, 0.10)',
        matrix: '0px 0px 15px 5px rgb(3, 160, 98)',
        matrixThin: '0px 0px 15px 5px rgba(3, 160, 98, 0.40)',
        error: '0px 0px 15px 5px rgba(255, 0, 0, 0.70)',
        errorThin: '0px 0px 15px 5px rgba(255, 0, 0, 0.40)',
      },
    },
    darkMode: 'selector',
    colors: {
      background: '#01012b',
      foregroundSubtle: '#005678',
      foreground: '#05d9e8',
      foregroundThin: 'rgba(5, 217, 232, 0.40)',
      primary: '#ff2a6d',
      primaryThin: 'rgba(255, 42, 109, 0.40)',
      matrix: 'rgb(3, 160, 98)',
      matrixThin: 'rgba(3, 160, 98, 0.40)',
      secondary: '#d1f7ff',
      error: '#ff0000',
      errorThin: 'rgba(255, 0, 0, 0.40)',
      success: '#00ff00',
      successThin: 'rgba(0, 255, 0, 0.40)',
      warning: '#ffff00',
      warningThin: 'rgba(255, 255, 0, 0.40)',
      white: '#ffffff',
      black: '#000000',
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@designbycode/tailwindcss-text-glitch'),
  ],
};
