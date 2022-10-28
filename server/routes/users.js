const path = require('path');
const express = require('express');
const {verificaAutenticacion} = require('./middleware');
const dotenv = require('dotenv');
dotenv.config()
const userController = require('../controllers/users');
const cryptoController = require('../controllers/cryptoController');
const router = express.Router();
router.post('/login', userController.usersLogin);
router.get('/crypto', verificaAutenticacion, cryptoController.getData);
router.get('/crypto/btc/ftx', verificaAutenticacion, cryptoController.getDataFTX);
router.get('/crypto/btc/ftx/15m', verificaAutenticacion, cryptoController.getDataFTX15m);
router.get('/crypto/btc/ftx/1h', verificaAutenticacion, cryptoController.getDataFTX1h);



module.exports = router;