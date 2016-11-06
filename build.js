({
  baseUrl: './',
  appDir: 'app/scripts',
  dir: '.tmp/scripts/build',
  mainConfigFile: 'app/scripts/app.js',

  modules: [
    {
      name: 'app',
    },
  ],

  optimize: 'uglify2',
});
