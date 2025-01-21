const express = require('express');
const router = express.Router();
const Controllers = require("../CONTROLLERS")
const Middlewares = require('../MIDDLEWARES');

/* HTTP status
*   2XX = sucesso
*   4XX = Erro do cliente
*   5XX = Erro do Servidor
*/

router.get(`/`, Controllers.User.getAll);

router.get(`/:id`, Controllers.User.getById);

router.delete(`/:id`, Controllers.User.delete);

router.post(`/create`,  Controllers.User.create);

router.patch(`/:id`, Controllers.User.update);


module.exports = router;