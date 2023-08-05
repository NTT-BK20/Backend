import pool from '../config/connectDB';

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

        const firstTwoCharacters = userId.slice(0, 2);
        console.log(firstTwoCharacters)
        if(firstTwoCharacters == 'SV'){
            await pool.execute('DELETE FROM student where id = ?;', [userId])
        }
        else if(firstTwoCharacters == 'GV'){
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
    deleteUser, deleteCourse,
}