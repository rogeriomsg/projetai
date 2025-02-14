const express = require('express')
const app = express();
const router = require("./ROUTERS")
const { errors } = require('celebrate');
const { ValidationErrorMessage } = require('./MIDDLEWARES/message');
const cors = require('cors');
var bodyParser = require('body-parser')

// Habilitar CORS
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.json({ limit: '30mb' })); // Ajuste conforme necessário
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

//app.use(express.json())
app.use("/user",router.User)
app.use("/api",router.WebhookToMQTT)
app.use("/project",router.Project)
app.use("/client",router.Client)


// Middleware para tratar erros de validação
app.use(errors());

//app.use(ValidationErrorMessage);
// Middleware personalizado para formatar erros
app.use(ValidationErrorMessage);

module.exports = app;
