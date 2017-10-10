import fs from 'fs'
import koaRouter from 'koa-router'

const router = koaRouter()

function addControllers(router) {
  const files = fs.readdirSync(__dirname + '/controllers')
  const jsFiles = files.filter( f => f.endsWith('.js') )
  for (let f of jsFiles) {
    console.log(`process controller: ${f}...`)
    let mapping = require(__dirname + '/controllers/' + f)
    addMapping(router, mapping)
  }
}

function addMapping(router, mapping) {
  for (let url in mapping) {
    if (url.startsWith('GET ')) {
      let path = url.substring(4)
      router.get(path, mapping[url])
      console.log(`request url mapping: GET ${path}`)
    } else if (url.startsWith('POST ')) {
      let path = url.substring(5)
      router.post(path, mapping[url])
      console.log(`request url mapping: POST ${path}`)
    } else if (url.startsWith('PUT ')) {
      let path = url.substring(5)
      router.put(path, mapping[url])
      console.log(`request url mapping: PUT ${path}`)
    } else if (url.startsWith('DELETE ')) {
      let path = url.substring(5)
      router.del(path, mapping[url])
      console.log(`request url mapping: DELETE ${path}`)
    } else {
      console.log(`invalid URL: ${url}`)
    }
  }
}

export default (dir) => {
  let controllerDir = dir || 'controllers'
  addControllers(router, controllerDir)
  return router.routes()
}