const pkg = require('./package.json');
const path = require('path');
const process = require('process');

module.exports = {
  // Entry is relative to process.cwd()
  entry: [
    'app/startup/app.jsx',
  ],

  html: {
    template: 'index.html'
  },

  dist: 'lib/assets',

  presets: [
    require('poi-preset-react')(),
    require('poi-preset-resolve-alias')({
      'active-resource': path.join(process.cwd(), 'node_modules', 'active-resource', 'build', 'active-resource.min.js'),
      'occasion-sdk': path.join(process.cwd(), 'node_modules', 'occasion-sdk', 'build', 'occasion-sdk.min.js'),
    })
  ],

  filename: {
    js: 'javascripts/' + pkg.name + '-[name]_bundle.js',
    css: 'stylesheets/' + pkg.name + '-[name]_bundle.css',
    images: 'images/[name].[ext]',
    fonts: 'fonts/[name].[ext]',
  }
};
