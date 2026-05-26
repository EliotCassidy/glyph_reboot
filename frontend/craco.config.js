module.exports = {
  babel: {
    plugins: [
      require.resolve("@babel/plugin-proposal-optional-chaining"),
      require.resolve("@babel/plugin-proposal-nullish-coalescing-operator"),
    ],
  },

  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
}