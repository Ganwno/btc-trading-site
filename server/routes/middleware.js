const jwt = require('jsonwebtoken');

let verificaAutenticacion = (req, res, next) => {
    let token = req.cookies.access_token;
    jwt.verify(token,'este es el seed', (err, decoded) => {
      if(err) {
        return res.status(401).json({
          ok: false,
          status: 401,
          err: {
            message: 'Token no valido'
          }
        });
      }
      req.usuario = decoded.usuario;
      next();
  });
  };

  module.exports = {
    verificaAutenticacion,
  }
  
