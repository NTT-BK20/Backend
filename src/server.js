import express from "express";
import configViewEngine from "./config/viewEngine"
import initWebRoutes from "./route/web";
import initAPIRoute from "./route/api";
import cors from 'cors';

require('dotenv').config();   // giup chayj dc dong process.env

const app = express();
let port = process.env.PORT || 8080;
app.use(cors({ origin: true }));

app.use((req, res, next) => {
    //check => return res.send()
    console.log('>>> run into my middleware')
    console.log(req.method)
    next();
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

configViewEngine(app);

initWebRoutes(app);

initAPIRoute(app);

app.listen(port, () =>{
    console.log('Running in port ' + port);
})