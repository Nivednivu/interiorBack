const express = require('express')
const { ro } = require('./controller')
const router = express.Router()


router.get('/ro',ro)

const Router = router
module.exports= Router