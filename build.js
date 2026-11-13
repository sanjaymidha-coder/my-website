// build.js
const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['src/js/main.js'],   // your original file
    bundle: true,
    minify: true,
    outfile: 'dist/main.js',           // output file name (same name!)
    target: ['es2017'],
    sourcemap: false,
    logLevel: 'info'
  })
  .catch(() => process.exit(1));
