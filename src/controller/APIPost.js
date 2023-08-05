import pool from '../config/connectDB';
import bcrypt from 'bcryptjs';

// Function to generate student_id from fullname
function getStudentIdFromFullname(fullname) {
    const nameParts = fullname.split(' ');
    let lastName = '';
    let firstNameInitials = '';

    if (nameParts.length >= 2) {
        lastName = nameParts[nameParts.length - 1];
        firstNameInitials = nameParts.slice(0, nameParts.length - 1).map(name => name.charAt(0)).join('');
    } else {
        lastName = nameParts[0];
    }

    // Chuyển đổi từ có dấu sang không dấu
    lastName = removeDiacritics(lastName);

    return `${lastName}${firstNameInitials}`;
}

function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

let createNewStudent = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let { fullname, username, email, school } = req.body;

        if ( !fullname || !username || !email || !school ) {
            return res.status(200).json({
                message: 'missing required params'
            })
        }
        
        // Check if the school exists
        const [schoolRow] = await connection.query('SELECT id FROM school WHERE name = ?', [school]);

        if (!schoolRow) {
            return res.status(404).json({
                message: 'School not found'
            });
        }
        console.log("Check school id: ",schoolRow[0].id)
        const school_id = schoolRow[0].id;

        let student_id = `SV${school_id}_${getStudentIdFromFullname(fullname)}`;
        let i = 0;
        while (true) {
            const [existingStudents] = await connection.query('SELECT id FROM student WHERE id = ?', [student_id]);
            if (existingStudents.length === 0) {
                break;
            }
            i++;
            student_id = `SV${school_id}_${getStudentIdFromFullname(fullname)}${i}`;
        }

        // Hash the password using bcryptjs (you need to install it using `npm install bcryptjs`)
        const hashedPassword = bcrypt.hashSync('Student@123', 10);
        console.log("Check: ",student_id)
        await pool.execute('INSERT INTO student (id, fullname, username, email, password, school) values (?, ?, ?, ?, ?, ?)',
        [student_id, fullname, username, email, hashedPassword, school]);

        await connection.commit();

        return res.status(200).json({
            message: 'Student was added successfully !'
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

module.exports = {
    createNewStudent, createNewTeacher,
}