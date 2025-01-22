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

router.post(`/create`,  Controllers.Client.create );

router.delete(`/:id`,Controllers.Client.delete);

router.patch(`/:id`,  Controllers.Client.update );

router.post(`/:id/consumer_unit`,Controllers.Client.consumerUnitCreate);

router.get(`/:id/consumer_unit/search`,Controllers.Client.consumerUnitSearch);

module.exports = router;