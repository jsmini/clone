var pkg = require('../package.json');

// 兼容 base 和 @jsmini/base，@jsmini/base 替换为 jsmini_base
var name = pkg.name.replace('@', '').replace(/\//g, '_');
var version = pkg.version;

var banner = 
`/*!
 * base ${version} (https://github.com/jsmini/base)
 * API https://github.com/jsmini/base/blob/master/doc/api.md
 * Copyright 2017-${(new Date).getFullYear()} jsmini. All Rights Reserved
 * Licensed under MIT (https://github.com/jsmini/base/blob/master/LICENSE)
 */
`;

exports.name = name;
exports.banner = banner;
