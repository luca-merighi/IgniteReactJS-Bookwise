import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bk-gray': {
          '100': '#F8F9FC',
          '200': '#E6E8F2',
          '300': '#D1D6E4',
          '400': '#8D95AF',
          '500': '#303F73',
          '600': '#252D4A',
          '700': '#181C2A',
          '800': '#0E1116',
        },
        'bk-green': {
          '100': '#50B2C0',
          '700': '#255D6A',
          '800': '#0A313C'
        },
        'bk-purple': {
          '100': '#8381D9',
          '700': '#2A2879'
        }
      },
      backgroundImage: {
        'gradient-vertical': 'linear-gradient(180deg, #7FD1CC 0%, #9694F5 100%)',
        'gradient-horizontal': 'linear-gradient(90deg, #7FD1CC 0%, #9694F5 100%)',
      }
    },
    boxShadow: {
      'modal-shadow': '-4px 0px 30px 0px #00000080'
    },
    keyframes: {
      overlayShow: {
        from: { opacity: '0' },
        to: { opacity: '1' },
      },
      overlayHide: {
        from: { opacity: '1' },
        to: { opacity: '0' },
      },
      contentShow: {
        from: { opacity: '0' },
        to: { opacity: '1' },
      },
      contentHide: {
        from: { opacity: '1' },
        to: { opacity: '0' },
      },
      bookModalShow: {
        from: { opacity: '0', transform: 'translateX(100%)' },
        to: { opacity: '1', transform: 'translateX(0%)' },
      },
      bookModalHide: {
        from: { opacity: '1', transform: 'translateX(0%)' },
        to: { opacity: '0', transform: 'translateX(100%)' },
      }
    },
    animation: {
      overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      overlayHide: 'overlayHide 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      contentHide: 'contentHide 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      bookModalShow: 'bookModalShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      bookModalHide: 'bookModalHide 150ms cubic-bezier(0.16, 1, 0.3, 1)'
    }
  },
  plugins: [
    require('tailwind-scrollbar')
  ]
}
export default config
