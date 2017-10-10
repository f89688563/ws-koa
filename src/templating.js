import nunjucks from 'nunjucks'

let createEnv = (path, opts) => {
  let
    autoescape = opts.autoescape === undefined ? true : opts.autoescape,
    noCache = opts.noCache || false,
    watch = opts.watch || false,
    throwOnUndefined = opts.throwOnUndefined || false,
    env = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(path, {
        noCache,
        watch
      }), {
        autoescape,
        throwOnUndefined
      }
    )
  if (opts.filters) {
    for (let f in opts.filters) {
      env.addFilter(f, opts.filters[f])
    }
  }
  return env
}

export default (path, opts) => {
  let env = createEnv(path, opts)
  return async (ctx, next) => {
    ctx.render = (view, model) => {
      ctx.response.body = env.render(view, Object.assign({}, ctx.state || {}, model || {}))
      ctx.response.type = 'text/html'
    }
    await next()
  }
}