var babel = require('@rollup/plugin-babel');

var pkg = require('../package.json');

var version = pkg.version;

var banner = `/*!
 * ${pkg.name} ${version} (https://github.com/jsmini/clone)
 * API https://github.com/jsmini/clone/blob/master/doc/api.md
 * Copyright 2017-${new Date().getFullYear()} jsmini. All Rights Reserved
 * Licensed under MIT (https://github.com/jsmini/clone/blob/master/LICENSE)
 */
`;

function getCompiler() {
  return babel({
    babelrc: false,
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers:
              'last 2 versions, > 1%, ie >= 11, Android >= 4.1, iOS >= 10.3',
            node: '14',
          },
          modules: false,
          loose: false,
        },
      ],
    ],
    plugins: [
      // [
      //   '@babel/plugin-transform-runtime',
      //   {
      //     corejs: 3,
      //     versions: '^7.22.15',
      //     helpers: true,
      //     regenerator: false,
      //   },
      // ],
    ],
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
  });
}

exports.name = 'jsmini_clone';
exports.banner = banner;
exports.getCompiler = getCompiler;
