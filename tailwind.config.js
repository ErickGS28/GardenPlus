/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'garden': {
                    'teal': '#1b676b',
                    'green': '#519548',
                    'lime': '#88c425',
                    'chartreuse': '#bef202',
                    'mint': '#eafde6'
                }
            },
            rotate: {
                '360': '360deg',
            },
            animation: {
                'letter-pop': 'letterPop 0.3s ease forwards',
            },
            keyframes: {
                letterPop: {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.3)' },
                  '100%': { transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
};