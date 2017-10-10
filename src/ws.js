import ws from 'ws'
import url from 'url'
import {parserUser} from './user'

const WebSocketServer = ws.Server
let messageIndex = 0

const createMessage = (type, user, data) => {
  messageIndex ++
  return JSON.stringify({
    id: messageIndex,
    type, user, data
  })
}

export const createWebSocketServer = (server, onConnection, onMessage, onClose, onError) => {
  let wss = new WebSocketServer({server})
  
  wss.broadcast = (data) => {
    wss.clients.forEach(client => client.send(data))
  }

  onConnection = onConnection || function () {
    let user = this.user
    let msg = createMessage('join', user, `${user.name} joined.`)
    this.wss.broadcast(msg)

    // 更新用户
    let users = []
    this.wss.clients.forEach(client => users.push(client.user))
    
    this.send(createMessage('list', user, users))
  }

  onMessage = onMessage || function (message) {
    console.log(message)
    if (message && message.trim()) {
      let msg = createMessage('chat', this.user, message.trim())
      this.wss.broadcast(msg)
    }
  }

  onClose = onClose || function () {
    let user = this.user
    let msg = createMessage('left', user, `${user.name} has left.`)
    this.wss.broadcast(msg)
  }

  onError = onError || function (err) {
    console.error(`[WebSocket] error: ${err}`)
  }

  wss.on('connection', (ws, req) => {
    let location = url.parse(req.url, true)
    console.log(`[WebSocketServer] connection: ${location.href}`)
    ws.on('message', onMessage)
    ws.on('close', onClose)
    ws.on('error', onError)

    if (location.pathname !== '/ws/chat') {
      ws.close(4000, 'Invalid URL')
    }

    let user = parserUser(req)
    if (!user) {
      ws.close(4001, 'Invalid User')
    }
    ws.user = user
    ws.wss = wss
    onConnection.apply(ws)
  })
  console.log('WebSocketServer was attached...')
  return wss
}