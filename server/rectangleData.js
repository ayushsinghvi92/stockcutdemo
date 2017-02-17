const bins = require('../../node/binPackTest.js');

const api = module.exports = require('express').Router()

api.use((req,res) => res.send(bins))
