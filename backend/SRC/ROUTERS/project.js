const express = require('express');
const router = express.Router();
const Controllers = require("../CONTROLLERS")
const {Validations} = require('../MIDDLEWARES');

/* HTTP status
*   2XX = sucesso
*   4XX = Erro do cliente
*   5XX = Erro do Servidor
*/

router.get(`/`,Controllers.Project.search);

router.get(`/:id`,Controllers.Project.byId);

router.post(`/`,  Controllers.Project.create );

router.patch(`/:id`,  Controllers.Project.update );

router.delete(`/:id`,Controllers.Project.delete);


module.exports = router;