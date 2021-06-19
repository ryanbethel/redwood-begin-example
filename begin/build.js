const { zipFunctions } = require('@netlify/zip-it-and-ship-it')

const beginBundle = async function () {
  const archives = await zipFunctions('functions', 'functions-dist', {
    archiveFormat: 'none',
    nodeBundler: 'esbuild_zisi',
  })

  return archives
}
