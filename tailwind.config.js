const defaultTheme = require('tailwindcss/defaultTheme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./views/*.pug'],
  theme: {
    extend: {
      screens: {
        xs: '430px',
        ...defaultTheme.screens,
      },
    },
  },
  plugins: [],
};
