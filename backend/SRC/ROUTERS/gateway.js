const express = require('express');
const router = express.Router();
const Controllers = require("../CONTROLLERS")
const Middlewares = require('../MIDDLEWARES');

/* HTTP status
*   2XX = sucesso
*   4XX = Erro do cliente
*   5XX = Erro do Servidor
*/

router.get(`/`,Controllers.Gateway.getAll);

router.get(`/:id`,Controllers.Gateway.getById);

router.delete(`/:id`,Controllers.Gateway.delete);

router.post(`/create`,Controllers.Gateway.create);

router.patch(`/:id`, Controllers.Gateway.update);

module.exports = router;