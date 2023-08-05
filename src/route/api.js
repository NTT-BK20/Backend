import express from "express";
import APIGet from '../controller/APIGet'
import APIPost from '../controller/APIPost'
import APIPut from '../controller/APIPut'
import APIDelete from '../controller/APIDelete'

let router = express.Router();

const  initAPIRoute = (app) => {
    //method GET -> Read DATA
    router.get('/user', APIGet.getAllUsers);
    router.get('/student', APIGet.getAllStudent);
    router.get('/teacher', APIGet.getAllTeacher);
    router.get('/course', APIGet.getAllCourse);
    router.get('/school', APIGet.getAllSchool);
    
    // method POST -> CREATE data
    router.post('/create-student', APIPost.createNewStudent);
    router.post('/create-teacher', APIPost.createNewTeacher);
    
    //method PUT -> UPDATE data
    router.put('/update-student', APIPut.updateStudent);
    router.put('/update-teacher', APIPut.updateTeacher);
    router.put('/update-course', APIPut.updateCourse);
    
    //method DELETE -> DELETE data
    router.delete('/delete-user/:id', APIDelete.deleteUser);
    router.delete('/delete-course/:id', APIDelete.deleteUser);

    // pagination
    router.get('/student/:page', APIGet.pageAllStudent);
    router.get('/teacher/:page', APIGet.pageAllTeacher);
    router.get('/course/:page', APIGet.pageAllCourse);

    return app.use('/api/', router)
}

module.exports = initAPIRoute;