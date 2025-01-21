const express = require('express');
const router = express.Router();
const Controllers = require("../CONTROLLERS")
const {Validations} = require('../MIDDLEWARES');

/* HTTP status
*   2XX = sucesso
*   4XX = Erro do cliente
*   5XX = Erro do Servidor
*/

router.get(`/search`,Controllers.Project.search);

router.get(`/:id`,Controllers.Project.getById);

router.delete(`/:id`,Controllers.Project.delete);

router.post(`/create`,  Controllers.Project.create );

router.patch(`/:id`,  Controllers.Project.update );

module.exports = router;