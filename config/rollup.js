var pkg = require('../package.json');

// 兼容 clone 和 @jsmini/clone，@jsmini/clone 替换为 jsmini_clone
var name = pkg.name.replace('@', '').replace(/\//g, '_');
var version = pkg.version;

var banner = 
`/*!
 * clone ${version} (https://github.com/jsmini/clone)
 * API https://github.com/jsmini/clone/blob/master/doc/api.md
 * Copyright 2017-${(new Date).getFullYear()} jsmini. All Rights Reserved
 * Licensed under MIT (https://github.com/jsmini/clone/blob/master/LICENSE)
 */
`;

exports.name = name;
exports.banner = banner;
