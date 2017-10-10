import path from 'path'
import mime from 'mime'
import fs from 'mz/fs'

export default (url, dir) => {
  return async (ctx, next) => {
    let rpath = ctx.request.path
    if (rpath.startsWith(url)) {
      let fp = path.join(dir, rpath.substring(url.length))
      if (await fs.exists(fp)) {
        // 查找文件的mime
        ctx.response.type = mime.getType(rpath)
        // 读取内容并赋值给body
        ctx.response.body = await fs.readFile(fp)
      } else {
        ctx.response.status = 404
      }
    } else {
      await next()
    }
  }
}