exports.middleware = (req, res, next) => {
    req.name = 'Jake'
    next()
}

exports.homePage = (req, res) => {
    console.log('TEST: ', req.name)
    res.render('index')
}