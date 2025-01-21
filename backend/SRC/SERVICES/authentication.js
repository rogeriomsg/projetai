const HTTPStatus = require("./HTTPStatus")

exports.IsAuthenticated = async (req, res) => {
    //console.log(req.body);
    const {body} = req ;
    //res.status(HTTPStatus.UNAUTHENTICATED_CLIENT.code);
    //throw new Error(HTTPStatus.UNAUTHENTICATED_CLIENT.message);
 };