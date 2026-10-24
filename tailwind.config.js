/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#F0F9FA',
          100: '#E0F3F5',
          200: '#BCE4E8',
          300: '#8ACED5',
          400: '#4EB2BD',
          500: '#1D97A4',
          600: '#087E8B', // Primary teal
          700: '#075E68', // Dark teal
          800: '#064A52',
          900: '#04363C',
          950: '#021F23',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#F8FBFC',
          subtle: '#F0F7F8',
          border: '#D7E5E7',
          muted: '#627D82',
        },
        alert: {
          safe: '#10B981',
          safeBg: '#ECFDF5',
          safeBorder: '#A7F3D0',
          caution: '#F59E0B',
          cautionBg: '#FFFBEB',
          cautionBorder: '#FDE68A',
          urgent: '#EF4444',
          urgentDark: '#DC2626',
          urgentBg: '#FEF2F2',
          urgentBorder: '#FECACA',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(8, 126, 139, 0.05), 0 1px 2px 0 rgba(8, 126, 139, 0.03)',
        'card': '0 4px 6px -1px rgba(8, 126, 139, 0.06), 0 2px 4px -1px rgba(8, 126, 139, 0.03)',
        'elevated': '0 10px 15px -3px rgba(8, 126, 139, 0.08), 0 4px 6px -2px rgba(8, 126, 139, 0.04)',
      }
    },
  },
  plugins: [],
}
