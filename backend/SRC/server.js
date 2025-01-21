require('dotenv').config();
const app = require('./app')
const mongoDB = require("./MODELS/connectionDB")
const MQTT = require("./SERVICES/mqtt")


const port = process.env.PORT

const result  = mongoDB.connect().then(
    result => {
        if(result.sucess === true)
        {
            console.log(result.message);
            app.listen(port,()=>{
                console.log(`Servidor rodando na porta ${port}`)
            })
        }
        else
        {
            console.log(result.message);
        }
    }
)


