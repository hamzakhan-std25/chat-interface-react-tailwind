// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // animation: {
      //   'fade-in-slow': 'fadeIn 2s ease-out forwards',
      // },
      // keyframes: {
      //   fadeIn: {
      //     '0%': { opacity: '0' },
      //     '100%': { opacity: '1' },
      //   },

        // bounce: {
        //   '0%, 60%, 100%': {
        //     transform: 'translateY(0)',
        //     opacity: '0.4'
        //   },
        //   '30%': {
        //     transform: 'translateY(-10px)',
        //     opacity: '1'
        //   }
        // },
        // msgIn: {
        //   '0%, 60%, 100%': {
        //     transform: 'translateY(0)',
        //     opacity: '0.4'
        //   },
        //   '30%': {
        //     transform: 'translateY(-10px)',
        //     opacity: '1'
        //   }
        // }


      // },
      borderBottomRightRadius: {
        '4': '4px',
      },
      borderBottomLeftRadius: {
        '4': '4px',
      },
    },
  },
  plugins: [],
}