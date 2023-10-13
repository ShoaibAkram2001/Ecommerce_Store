const dotenv = require("dotenv");
//password=vyoSj1DcHpfqR3iG;
const mongodb = require("mongoose");
dotenv.config({ path: "../server/config/config.env" });

function DBConnection() {
  mongodb
    .connect(process.env.MONGO_URL)
    .then((data) =>
      console.log(`Mongodb connected with server :${mongodb.connection.host}`)
    )
    .catch((eror) => {
      console.error(eror);
    });
}

module.exports = DBConnection;
