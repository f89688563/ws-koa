import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import controller from './src/controller'
import staticFiles from './src/static-files'
import templating from './src/templating'
import {parserUser} from './src/user'
import {createWebSocketServer} from './src/ws'

const app = new Koa()
const isProduction = process.env.NODE_ENV === 'production'

if (!isProduction) {
  app.use(staticFiles('/static/', __dirname + '/static'))
}

// 解析cookies
app.use(async (ctx, next) => {
  ctx.state.user = parserUser(ctx.cookies.get('name') || '')
  await next()
})

// 解析post
app.use(bodyParser())

// 模板引擎
app.use(templating('views', {
  noCache: !isProduction,
  watch: !isProduction
}))

app.use(controller())

let server = app.listen(3000)
app.wss = createWebSocketServer(server)
console.log('app start at port 3000')