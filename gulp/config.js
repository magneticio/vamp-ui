var dest = './build',
    src = './src'

module.exports = {
  browserSync: {
    server: {
      // We're serving the src folder as well
      // for sass sourcemap linking
      baseDir: [dest, src]
    },
    files: [
      dest + '/**'
    ]
  },
  sass: {
    src: src + '/scss/style.scss',
    watch: [
      src + '/scss/**/*',
    ],
    dest: dest
  },
  markup: {
    src: src + "/www/**",
    dest: dest
  },
  fonts: {
    src: './flat-ui/fonts/**',
    dest: './build/fonts'
  },
  browserify: {
    // Enable source maps
    debug: true,
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: src + '/app/app.jsx',
      dest: dest,
      outputName: 'app.js'
    }]
  }
};
