import * as path from 'path';
import depcheck = require('depcheck');
import * as fs from 'fs';

const packageJson = require('../../package.json')
const ROOT_PATH = path.resolve(__dirname + '/../..')
const srcProjectPath = `${ROOT_PATH}/apps/functions`
const distProjectPath = `${ROOT_PATH}/dist/apps/functions`

console.log('Creating cloud functions files...')

let packageJsonStub = {
  engines: { node: '10' },
  main: 'main.js',
}

depcheck(
  distProjectPath,
  {
    package: {
      dependencies: packageJson.dependencies,
    },
  },
  (unused) => {
    const dependencies = packageJson.dependencies
    if (unused.dependencies.length > 0)
      unused.dependencies.reduce((acc, dep, i) => {
        delete acc[dep]
        return acc
      }, dependencies)

    fs.promises.mkdir(
      path.dirname(distProjectPath),
      { recursive: true }
    ).then(() => {
      fs.promises.writeFile(
        `${distProjectPath}/package.json`,
        JSON.stringify({
          ...packageJsonStub,
          dependencies,
        })
      )
        .then(() =>
          console.log(`${distProjectPath}/package.json written successfully.`)
        )
        // .then(() =>
        //   fs.promises.copyFile(
        //     `${srcProjectPath}/.runtimeconfig.json`,
        //     `${distProjectPath}/.runtimeconfig.json`,
        //   )
        // )
        // .then(() =>
        //   console.log(`${distProjectPath}/.runtimeconfig.json written successfully.`)
        // )
        .catch(e => console.error(e))
    })
  }
)