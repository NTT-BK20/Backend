import pool from '../config/connectDB';
import bcrypt from 'bcryptjs';
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
            if(user.dateofbirth){
                const date = new Date(user.dateofbirth);
                const formattedDate = date.toISOString().split('T')[0];
                return {
                    ...user,
                    dateofbirth: formattedDate
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
            if(student.dateofbirth){
                const date = new Date(student.dateofbirth);
                const formattedDate = date.toISOString().split('T')[0];
                return {
                    ...student,
                    dateofbirth: formattedDate
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
            if(teacher.dateofbirth){
                const date = new Date(teacher.dateofbirth);
                const formattedDate = date.toISOString().split('T')[0];
                return {
                    ...teacher,
                    dateofbirth: formattedDate
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

let pageAllStudent = async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let page = req.params.page || 1;
        const sqlQuery= `
        SELECT s.*, st.course_id 
        FROM student s
        JOIN course_student st ON s.id = st.student_id;
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

let createNewStudent = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let { user_id, fullname, username, email } = req.body;

        if ( !user_id || !fullname || !username || !email ) {
            return res.status(200).json({
                message: 'missing required params'
            })
        }

        // Hash the password using bcryptjs (you need to install it using `npm install bcryptjs`)
        const hashedPassword = bcrypt.hashSync('Student@123', 10);

        await pool.execute('INSERT INTO student (id, fullname, username, email, password) values (?, ?, ?, ?, ?)',
        [user_id, fullname, username, email, hashedPassword]);

        // If there's a course, add it for the user
        // if (course) {
        //     await pool.execute('INSERT INTO course_student (user_id, course_id) VALUES (?, (SELECT id FROM course WHERE name = ?));',
        //     [user_id, course]);
        // }

        await connection.commit();

        return res.status(200).json({
            message: 'Student added successfully !'
        })
    } catch (error) {
        console.error('Error creating student:', error);
        return res.status(500).json({
            message: 'Error creating student'
        });
    } finally {
        connection.release();
    }
}

let createNewTeacher = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let { user_id, fullname, username, email } = req.body;

        if ( !user_id || !fullname || !username || !email ) {
            return res.status(200).json({
                message: 'missing required params'
            })
        }

        // Hash the password using bcryptjs (you need to install it using `npm install bcryptjs`)
        const hashedPassword = bcrypt.hashSync('Teacher@123', 10);

        await pool.execute('INSERT INTO student (id, fullname, username, email, password) values (?, ?, ?, ?, ?)',
        [user_id, fullname, username, email, hashedPassword]);

        await connection.commit();

        return res.status(200).json({
            message: 'Student added successfully !'
        })
    } catch (error) {
        console.error('Error creating student:', error);
        return res.status(500).json({
            message: 'Error creating student'
        });
    } finally {
        connection.release();
    }
}

let updateStudent = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let { id, fullname, username, email, phone, dateofbirth, school, major, profile_image} = req.body;
        if ( !id || !fullname || !username || !email ) {
            return res.status(200).json({
                message: 'missing required params'
            })
        }

        await pool.execute('UPDATE student SET fullname= ?, username = ? , email = ?, dateofbirth = ?, school = ?, major = ?, profile_image = ? where id = ?',
            [fullname, username, email, phone, dateofbirth, school, major, profile_image, id]);
        
        await connection.commit();
        
        return res.status(200).json({
        message: 'ok'
        })
    } catch (error) {
        console.error('Error updating student:', error);
        return res.status(500).json({
            message: 'Error updating student'
        });
    } finally {
        connection.release();
    }
}

let updateTeacher = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let { id, fullname, username, email, phone, dateofbirth, school, major, profile_image} = req.body;
        if ( !id || !fullname || !username || !email ) {
            return res.status(200).json({
                message: 'missing required params'
            })
        }

        await pool.execute('UPDATE teacher SET fullname= ?, username = ? , email = ?, dateofbirth = ?, school = ?, major = ?, profile_image = ? where id = ?',
            [fullname, username, email, phone, dateofbirth, school, major, profile_image, id]);
        
        await connection.commit();
        
        return res.status(200).json({
        message: 'ok'
        })
    } catch (error) {
        console.error('Error updating student:', error);
        return res.status(500).json({
            message: 'Error updating student'
        });
    } finally {
        connection.release();
    }
}

let updateCourse = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let { id, teacher_id, name, skill, price, max_student, total_student, status } = req.body;
        if ( !id || !name || !skill || !price ) {
            return res.status(200).json({
                message: 'missing required params'
            })
        }

        await pool.execute('UPDATE course SET teacher_id = ?, name = ?, skill = ?, price = ?, max_student = ?, total_student = ?, status = ? where id = ?',
            [teacher_id, name, skill, price, max_student, total_student, status, id]);
        
        await connection.commit();
        
        return res.status(200).json({
        message: 'ok'
        })
    } catch (error) {
        console.error('Error updating course:', error);
        return res.status(500).json({
            message: 'Error updating course'
        });
    } finally {
        connection.release();
    }
}

let deleteUser = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                message: 'missing required params'
            })
        }

        const firstTwoCharacters = userID.slice(0, 2);
        if(firstTwoCharacters == "SV"){
            await pool.execute('DELETE FROM student where id = ?;', [userId])
        }
        else if(firstTwoCharacters == "GV"){
            await pool.execute('DELETE FROM teacher where id = ?;', [userId])
        }
        
        await connection.commit();
        
        return res.status(200).json({
            message: 'ok'
        })
    } catch (error) {
        console.error('Error delete student:', error);
        
        await connection.rollback();

        return res.status(500).json({
            message: 'Error delete student'
        });
    } finally {
        connection.release();
    }
}

let deleteCourse = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let courseId = req.params.id;
        if (!courseId) {
            return res.status(200).json({
                message: 'missing required params'
            })
        }
        //await pool.execute('delete from course_student where user_id = ?', [userId]);
        await pool.execute('DELETE FROM course where id = ?;', [courseId])
        
        await connection.commit();

        return res.status(200).json({
            message: 'ok'
        })
    } catch (error) {
        console.error('Error delete course:', error);
        
        await connection.rollback();

        return res.status(500).json({
            message: 'Error delete course'
        });
    } finally {
        connection.release();
    }
}

module.exports = {
    getAllUsers, getAllStudent, getAllTeacher, getAllCourse, 
    createNewStudent, createNewTeacher,
    updateTeacher, updateStudent, updateCourse, 
    deleteUser, deleteCourse,
    pageAllStudent, pageAllCourse, pageAllTeacher,
}