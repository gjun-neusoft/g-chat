const router = require('koa-router')()
const chat = require('../chat')
router.prefix('/chat')

chat()
module.exports = router