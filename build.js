{
  appDir: 'app',
  dir: '../../dist/scripts',
  mainConfigFile: 'app/scripts/main.js',
  modules: [
    {
      name: 'common',

      include: [
        'jquery'
      ]
    },

    // {
    //   name: 'mainview',
    //   include: ['views/main', 'models/model']
    // }
  ],

  optimize: 'uglify2'

}
