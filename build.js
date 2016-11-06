({
  baseUrl: './',
  appDir: 'app/scripts',
  dir: '.tmp/scripts/build',
  mainConfigFile: 'app/scripts/app.js',
  // name: 'app/views/main.js',
//
  modules: [
    {
      name: 'app',

      // include: [
      //   'vendor/jquery',
      //   'vendor/backbone',
      // ]
    },

    // {
    //   name: 'mainview',
    //   include: ['views/main', 'models/model']
    // }
  ],

  optimize: 'uglify2',

  // out: 'main-built.js'

});
