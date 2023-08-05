import pool from '../config/connectDB';

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

        // Check and set optional fields
        phone = phone || null;
        dateofbirth = dateofbirth || null;
        school = school || null;
        major = major || null;
        profile_image = profile_image || null;

        await pool.execute('UPDATE student SET fullname= ?, username = ? , email = ?, phone = ?, dateofbirth = ?, school = ?, major = ?, profile_image = ? where id = ?;',
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

        // Check and set optional fields
        phone = phone || null;
        dateofbirth = dateofbirth || null;
        school = school || null;
        major = major || null;
        profile_image = profile_image || null;

        await pool.execute('UPDATE teacher SET fullname= ?, username = ? , email = ?, phone = ?, dateofbirth = ?, school = ?, major = ?, profile_image = ? where id = ?;',
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

        // Check and set optional fields
        teacher_id = teacher_id || null;
        max_student = max_student || null;
        total_student = total_student || null;
        status = status || 'open';

        await pool.execute('UPDATE course SET teacher_id = ?, name = ?, skill = ?, price = ?, max_student = ?, total_student = ?, status = ? where id = ?;',
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

module.exports = {
    updateTeacher, updateStudent, updateCourse, 
}