[npm-badge]: https://badge.fury.io/js/import-paths.svg
[npm-url]: https://npmjs.org/package/import-paths
[travis-badge]: https://travis-ci.org/Dreamscapes/import-paths.svg
[travis-url]: https://travis-ci.org/Dreamscapes/import-paths
[inch-badge]: http://inch-ci.org/github/Dreamscapes/import-paths.svg
[inch-url]: http://inch-ci.org/github/Dreamscapes/import-paths
[make-badge]: https://img.shields.io/badge/built%20with-GNU%20Make-brightgreen.svg

# import-paths

[![NPM Version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Documentation Status][inch-badge]][inch-url]
![Built with GNU Make][make-badge]

> Make your local imports and requries pretty!

## Description

> **WARNING**
> This package modifies the global `require()` function. Do not use this if you do not completely control your execution environment (ie. don't use this when writing a library for 3rd parties etc.).

This package allows you to resolve your local project modules by using a pre-configured prefix when you `require()` them, instead of having to use relative paths to that module from wherever you are.

Instead of

```js
const User = require('./api/models/user')
```

You can now write

```js
const User = require('api:models/user')
```

Now, the path to the `User` model will be always the same, no matter where you require it (as long as the `User` model does not change its location, that is!).

## Usage

Require this module at the soonest opportunity in your application's lifecycle, most likely in an *app.js*, *server.js* or *index.js* files and call it with an object which contains keys as the prefixes you would like to register and the keys' values being the absolute paths where those require calls should be directed to. The paths can also be arrays - in that case, they will be `path.join()`ed for you.

```js
require('import-paths')({
  api: [__dirname, 'api'],
  'api:controller': [__dirname, 'api' 'controllers'],
  'api:model': [__dirname, 'api' 'models'],
})
```

Now, if you `require('api:model:user')`, the actual model's path with be resolved to something like `/users/me/project-root/api/models/user`.

You can register as many prefixes as you like. Generally I would suggest using some kind of common pattern, so that it's obvious to everyone what is actually being required.

Other `require` statements which do not contain a colon (`:`) will be unmodified and will work as usual. You can even keep using relative paths if you are so inclined, but then... what's the point of using this library? 😀

## License

This software is licensed under the **BSD-3-Clause License**. See the [LICENSE](LICENSE) file for more information.
