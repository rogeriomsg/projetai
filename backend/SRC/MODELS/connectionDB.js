
const mongoose = require("mongoose");

const uri = process.env.URI

const connect = async () => {
    await mongoose.connect(uri)
    .then( () => {
        msg = 'Sucesso ao conectar para MongoDB Atlas' ;
        result = true;
    })
    .catch( (err) => {
        msg = `Erro ao tentar conectar ao banco de dados [${err}]`;
        result = false;
    })
    return {sucess: result , message: msg };
}

module.exports = {
    connect
}
