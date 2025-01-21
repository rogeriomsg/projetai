const express = require('express');
const router = express.Router();
const Controllers = require("../CONTROLLERS")
const {Validations} = require('../MIDDLEWARES');

/* HTTP status
*   2XX = sucesso
*   4XX = Erro do cliente
*   5XX = Erro do Servidor
*/

router.get(`/`,Controllers.Device.getAll);

router.get(`/:id`,Controllers.Device.getById);

router.delete(`/:id`,Controllers.Device.delete);

router.post(`/create`, Validations.Device.Validate , Controllers.Device.create );

router.patch(`/:id`, Validations.Device.Validate , Controllers.Device.update );

module.exports = router;