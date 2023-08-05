import mysql from 'mysql2/promise';

console.log("Creating connection pool...");

const pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    database: 'tlearndb1',
    password: 'admin',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
})


export default pool;