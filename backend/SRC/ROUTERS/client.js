const express = require('express');
const router = express.Router();
const Controllers = require("../CONTROLLERS")
const {Validations} = require('../MIDDLEWARES');

/* HTTP status
*   2XX = sucesso
*   4XX = Erro do cliente
*   5XX = Erro do Servidor
*/

router.get(`/search`,Controllers.Client.search);

router.get(`/:id`,Controllers.Client.getById);

router.delete(`/:id`,Controllers.Client.delete);

router.post(`/create`,  Controllers.Client.create );

router.patch(`/:id`,  Controllers.Client.update );

router.post(`/:id/consumer_unit_create`,Controllers.Client.consumerUnitCreate);

router.get(`/:id/consumer_unit_search`,Controllers.Client.search);

module.exports = router;