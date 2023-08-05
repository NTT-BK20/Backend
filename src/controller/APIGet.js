import pool from '../config/connectDB';
const perPage = 10;

let getAllUsers = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const sqlQuery = `
        SELECT * FROM Teacher
        UNION SELECT * FROM Student;
        `;

        const [rows] = await pool.execute(sqlQuery);
        
        await connection.commit();

        const users = rows.map(user => {
            if(user.dayofbirth){
                const date = new Date(user.dayofbirth);
                const formattedDate = date.toISOString().split('T')[0];
                return {
                    ...user,
                    dayofbirth: formattedDate
                };
            }
            else {
                return user
            }
        });

        return res.status(200).json({
            message: 'Connection Successfully',
            data: users
        })
    } catch (error) {
        console.error('Error getting users:', error);
        
        await connection.rollback();

        return res.status(500).json({
            message: 'Error getting users'
        });
    } finally {
        connection.release();
    }
}

let getAllStudent = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [rows] = await connection.execute('SELECT * FROM student');

        await connection.commit();

        const students = rows.map(student => {
            if(student.dayofbirth){
                const date = new Date(student.dayofbirth);
                const formattedDate = date.toISOString().split('T')[0];
                return {
                    ...student,
                    dayofbirth: formattedDate
                };
            }
            else {
                return student
            }
        });

        return res.status(200).json({
            message: 'Connection Successfully',
            data: students
        });
    } catch (error) {
        console.error('Error getting students:', error);
        
        await connection.rollback();

        return res.status(500).json({
            message: 'Error getting students'
        });
    } finally {
        connection.release();
    }
};

let getAllTeacher = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [rows, fields] = await pool.execute('SELECT * FROM teacher;');

        await connection.commit();

        const teachers = rows.map(teacher => {
            if(teacher.dayofbirth){
                const date = new Date(teacher.dayofbirth);
                const formattedDate = date.toISOString().split('T')[0];
                return {
                    ...teacher,
                    dayofbirth: formattedDate
                };
            }
            else{
                return teacher
            }
        });

        return res.status(200).json({
            message: 'Connection Successfully',
            data: teachers
        })
    } catch (error) {
        console.error('Error getting teachers:', error);
        return res.status(500).json({
            message: 'Error getting teachers'
        });
    } finally {
        connection.release();
    }
}

let getAllCourse = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [rows] = await pool.execute('SELECT * FROM course');

        await connection.commit();

        return res.status(200).json({
            message: 'Connection Successfully',
            data: rows,
        })
    } catch (error) {
        console.error('Error getting courses:', error);
        return res.status(500).json({
            message: 'Error getting courses'
        });
    } finally {
        connection.release();
    }
}

let getAllSchool = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [rows] = await pool.execute('SELECT * FROM school');

        await connection.commit();

        return res.status(200).json({
            message: 'Connection Successfully',
            data: rows,
        })
    } catch (error) {
        console.error('Error getting schools:', error);
        return res.status(500).json({
            message: 'Error getting schools'
        });
    } finally {
        connection.release();
    }
}

let pageAllStudent = async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let page = req.params.page || 1;
        const sqlQuery= `
        SELECT s.*, GROUP_CONCAT(st.course_id) AS course_ids
        FROM student s
        LEFT JOIN course_student st ON s.id = st.student_id
        GROUP BY s.id;
        `;
        const [rows] = await pool.execute(sqlQuery);
        
        await connection.commit();
        
        const students = rows.map(student => {
            if (student.dayofbirth) {
                const date = new Date(student.dayofbirth);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                const formattedDate = `${year}-${month}-${day}`;
                return {
                    ...student,
                    dayofbirth: formattedDate
                };
            } else {
                return student;
            }
        });

        const totalCount = students.length;
        const totalPages = Math.ceil(totalCount / perPage);
        const startIndex = (page - 1) * perPage;
        const endIndex = page * perPage;
        const paginatedStudents = students.slice(startIndex, endIndex);
        
        res.status(200).json({
            message: 'Connection Successfully',
            data: paginatedStudents,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (error) {
        console.error('Error getting students:', error);
        return res.status(500).json({
            message: 'Error getting students'
        });
    } finally {
        connection.release();
    }
}

let pageAllCourse = async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let page = req.params.page || 1;
        const sqlQuery= `
        SELECT c.id , teacher_id , name, skill, price, max_students, total_student, status, day_of_week, lessons_number, lessons_taken, start_date, end_date, start_time, end_time, note 
        FROM course c
        JOIN schedule_course sc ON c.id = sc.course_id;
        `;
        const [rows] = await pool.execute(sqlQuery);
        
        await connection.commit();

        const totalCount = rows.length;
        const totalPages = Math.ceil(totalCount / perPage);
        const startIndex = (page - 1) * perPage;
        const endIndex = page * perPage;
        const paginatedStudents = rows.slice(startIndex, endIndex);
        
        res.status(200).json({
            message: 'Connection Successfully',
            data: paginatedStudents,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (error) {
        console.error('Error getting students:', error);
        return res.status(500).json({
            message: 'Error getting students'
        });
    } finally {
        connection.release();
    }
}

let pageAllTeacher = async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let page = req.params.page || 1;
        
        const sqlQuery= `
        SELECT *
        FROM teacher;
        `;
        const [rows] = await pool.execute(sqlQuery);
        
        await connection.commit();

        const teachers = rows.map(teacher => {
            if (teacher.dayofbirth) {
                const date = new Date(teacher.dayofbirth);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                const formattedDate = `${year}-${month}-${day}`;
                return {
                    ...teacher,
                    dayofbirth: formattedDate
                };
            } else {
                return teacher;
            }
        });

        const totalCount = teachers.length;
        const totalPages = Math.ceil(totalCount / perPage);
        const startIndex = (page - 1) * perPage;
        const endIndex = page * perPage;
        const paginatedStudents = teachers.slice(startIndex, endIndex);
        
        res.status(200).json({
            message: 'Connection Successfully',
            data: paginatedStudents,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (error) {
        console.error('Error getting students:', error);
        return res.status(500).json({
            message: 'Error getting students'
        });
    } finally {
        connection.release();
    }
}
module.exports = {
    getAllUsers, getAllStudent, getAllTeacher, getAllCourse, getAllSchool,
    pageAllStudent, pageAllCourse, pageAllTeacher,
}