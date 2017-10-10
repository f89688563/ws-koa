const fn_index = async (ctx, next) => {
    let user = ctx.state.user
    if (user) {
        ctx.render('room.html', {user})
    } else {
        ctx.response.redirect('/signin')
    }
    // ctx.render('index.html', {
    //     title: 'Welcome'
    // })
}

const fn_signin = async (ctx, next) => {
  let email = ctx.request.body.email || '',
      password = ctx.request.body.password || ''
  console.log(`signin with email: ${email}, password: ${password}`)
  if (email === 'admin@example.com' && password === '12345') {
    ctx.render('signin-ok.html', {
        title: 'signin ok',
        name: email
    })
  } else {
    ctx.render('signin-failed.html', {
        title: 'signin failed'
    })
  }
}

module.exports = {
  'GET /': fn_index,
//   'POST /signin': fn_signin
}