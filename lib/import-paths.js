/**
 * import-paths
 *
 * @author      Robert Rossmann <robert.rossmann@me.com>
 * @copyright   2016 Robert Rossmann
 * @license     BSD-3-Clause
 */

'use strict'

const path = require('path')
const Module = require('module')
const req = Module.prototype.require
const isOverriden = Symbol('import-paths override marker')
const registry = {}

/**
 * Monkey-patch the require function to support prefixed requires
 *
 * @param     {Object}    opts    The prefixes and their respective absolute paths
 * @return    {void}
 */
module.exports = function importpaths(opts) {
  opts = opts || {}

  // If there are any paths in array notation, join them into actual paths
  for (const key of Object.keys(opts)) {
    if (opts[key] instanceof Array) {
      opts[key] = path.join.apply(path, opts[key])
    }
  }

  // Aaaand, put those keys and their locations into the registry! And that's basically it!
  Object.assign(registry, opts)

  // If this is the first time we are called, apply the require override
  if (Module.prototype.require[isOverriden]) {
    // Nothing more to do, the require hook is already in place
    return
  }

  Module.prototype.require = importpathsRequire
  Module.prototype.require[isOverriden] = true
}

/**
 * Custom require hook
 *
 * @param     {String}    dest    Path to the file being required
 * @return    {Module}            The actual module being required
 * @this      Module
 */
function importpathsRequire(dest) {
  const parts = dest.split(':')
  // The last part is always the final path to a module
  const rest = parts.pop()
  // The rest will be treated as the actual prefix, ie. api:service:myService.js
  const prefix = parts.join(':')

  // This is not a path that contains prefix at all!
  if (!prefix) {
    return req.call(this, dest)
  }

  // Sanity check - if someone uses a prefix that we do not know about, attempt to crash the
  // process 🔥
  if (!registry[prefix]) {
    throw new Error(`Use of unregistered require prefix: ${prefix}`)
  }

  // All good now! Replace the prefix with the actual absolute path and require the module!
  dest = path.join(registry[prefix], rest)

  return req.call(this, dest)
}
