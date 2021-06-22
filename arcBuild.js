const { zipFunctions } = require('@netlify/zip-it-and-ship-it')
const toml = require('toml')
const fs = require('fs')
const path = require('path')
const buildToRoot = './.begin/api/dist/functions'
const apiSrc = './api/dist/functions'
const static = './web/dist'

const redwoodConfig = fs.readFileSync('redwood.toml', 'utf-8')
const apiProxyPath = toml.parse(redwoodConfig).web.apiProxyPath
const functions = fs.readdirSync(apiSrc)

async function beginBundle(src, buildTo) {
  const archives = await zipFunctions(src, buildTo, {
    archiveFormat: 'none',
    nodeBundler: 'esbuild_zisi',
  })
  return archives
}

function buildIndex(handler) {
  return `
'use strict'
const { handler } = require('${path.parse(handler).name}')

exports.handler = handler
  `
}

function arcManifest({ apiProxy, functions, staticPath }) {
  return `
@app
begin-redwood

@static
folder ${staticPath}

@http
${functions.map(func =>
(`${apiProxyPath}/${path.parse(func).name}
  method post
  src .begin/api/dist/${path.parse(func).name}`)).join('\n')}
  `
}

beginBundle(apiSrc, buildToRoot).then(() => {
  functions.forEach((file) => {
    fs.writeFileSync(buildToRoot+'/'+path.parse(file).name+'/index.js',buildIndex(file))
  })
  fs.writeFileSync('app.arc',arcManifest({apiProxy:apiProxyPath,staticPath:static,functions}))
}
)
