const express = require('express');
const router = express.Router();
const Controllers = require("../CONTROLLERS")
const Middlewares = require('../MIDDLEWARES');

/* HTTP status
*   2XX = sucesso
*   4XX = Erro do cliente
*   5XX = Erro do Servidor
*/

router.get(`/`,Controllers.DeviceCategory.getAll);

router.get(`/:id`,Controllers.DeviceCategory.getById);

router.delete(`/:id`,Controllers.DeviceCategory.delete);

router.post(`/create`,Controllers.DeviceCategory.create);

router.patch(`/:id`, Controllers.DeviceCategory.update);

module.exports = router;