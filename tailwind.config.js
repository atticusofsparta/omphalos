/** @type {import('tailwindcss').Config} */

function createBottomShadow(color) {
  /* offset-x | offset-y | blur-radius | spread-radius | color */

  const t = 'rgba(0, 0, 0, 0)';
  const right = '-5px 0px 15px 5px';
  const left = '5px 0px 15px 5px';
  const top = '0px 0px 15px 5px';
  const bottom = '0px 10px 10px 0px';

  return `${left} ${t}, ${right} ${t} ,${bottom} ${color}, ${top} ${t}`;
}
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
        'cool-cyan': 'linear-gradient(90deg, #01012b, #05d9e8)',
        'cool-cyan-thin':
          'linear-gradient(90deg, rgba(1, 1, 43, 0.4), rgba(5, 217, 232, 0.4))',
        'vibrant-pink': 'linear-gradient(90deg, #ff2a6d, #d1f7ff)',
        'vibrant-pink-thin':
          'linear-gradient(90deg, rgba(255, 42, 109, 0.4), rgba(209, 247, 255, 0.4))',
        'forest-green': 'linear-gradient(90deg, #01012b, rgb(3, 160, 98))',
        'forest-green-thin':
          'linear-gradient(90deg, rgba(1, 1, 43, 0.4), rgba(3, 160, 98, 0.4))',
        'ocean-blue': 'linear-gradient(90deg, #005678, #d1f7ff)',
        'ocean-blue-thin':
          'linear-gradient(90deg, rgba(0, 86, 120, 0.4), rgba(209, 247, 255, 0.4))',
        'sunset-orange': 'linear-gradient(90deg, #ff2a6d, #ffff00)',
        'sunset-orange-thin':
          'linear-gradient(90deg, rgba(255, 42, 109, 0.4), rgba(255, 255, 0, 0.4))',
        'night-sky': 'linear-gradient(90deg, #01012b, #000000)',
        'night-sky-thin':
          'linear-gradient(90deg, rgba(1, 1, 43, 0.4), rgba(0, 0, 0, 0.4))',
        'error-alert': 'linear-gradient(90deg, #ff0000, #ff2a6d)',
        'error-alert-thin':
          'linear-gradient(90deg, rgba(255, 0, 0, 0.4), rgba(255, 42, 109, 0.4))',
        'success-green': 'linear-gradient(90deg, #00ff00, #d1f7ff)',
        'success-green-thin':
          'linear-gradient(90deg, rgba(0, 255, 0, 0.4), rgba(209, 247, 255, 0.4))',
        warning: 'linear-gradient(90deg, #ffff00, #ff2a6d)',
        'warning-thin':
          'linear-gradient(90deg, rgba(255, 255, 0, 0.4), rgba(255, 42, 109, 0.4))',
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
        primaryThinBottom: createBottomShadow('rgba(255, 42, 109, 0.20)'),
        matrix: '0px 0px 15px 5px rgb(3, 160, 98)',
        matrixThin: '0px 0px 15px 5px rgba(3, 160, 98, 0.40)',
        error: '0px 0px 15px 5px rgba(255, 0, 0, 0.70)',
        errorThin: '0px 0px 15px 5px rgba(255, 0, 0, 0.40)',
        warning: '0px 0px 15px 5px rgba(255, 255, 0, 0.70)',
        warningThin: '0px 0px 15px 5px rgba(255, 255, 0, 0.40)',
        warningThinBottom: createBottomShadow('rgba(255, 255, 0, 0.40)'),
        secondary: '0px 0px 15px 5px #d1f7ff',
        secondaryThin: '0px 0px 15px 5px rgba(209, 247, 255, 0.40)',
        foreground: '0px 0px 15px 5px #05d9e8',
        foregroundThin: '0px 0px 15px 5px rgba(5, 217, 232, 0.40)',
      },
    },
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
      secondaryThin: 'rgba(209, 247, 255, 0.40)',
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
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
