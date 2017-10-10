import Cookies from 'cookies'

export const parserUser = (obj) => {
  if (!obj) return

  console.log(`try parse ${obj}`)
  let s = ''
  if (typeof obj === 'string') {
    s = obj
  } else if (obj.headers) {
    let cookies = new Cookies(obj, null)
    s = cookies.get('name')
  }

  if (s) {
    try {
      let user = JSON.parse(Buffer.from(s, 'base64').toString())
      console.log(`User: ${user.name}, ID: ${user.id}`)
      return user
    } catch(err) {
      console.log(`error: ${err}`)
    }
  }
}