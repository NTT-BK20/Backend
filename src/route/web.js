import express from "express";
import home from '../controller/HomeController';
// import userController from '../controllers/userController';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/home", home.handleHelloWord);
    router.get("/", (req, res) => {
        return res.send("Hello world!");
    })

    return app.use("/", router);
}

module.exports = initWebRoutes;