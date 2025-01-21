const express = require('express')
const app = express();
const router = require("./ROUTERS")
const { errors } = require('celebrate');
const { ValidationErrorMessage } = require('./MIDDLEWARES/message');

app.use(express.json())
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
