
const http=require('http');
const dotenv=require('dotenv');
dotenv.config({path:"./server/config/config.env"})
const DBConnection=require('./database/db');

DBConnection();


const app=require('./app');


const PORT=process.env.PORT || 5000;


const server=http.createServer(app);

server.on("error", (error) => {
    console.error("Server error:", error);
  });

server.listen(PORT,()=>{
    console.log(`Server is listening request on PORT ${PORT}`)
})

