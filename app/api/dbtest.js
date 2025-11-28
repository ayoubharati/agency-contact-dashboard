import mysql from "mysql2/promise";

export default async function handler(req, res) {
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: 3306,
            ssl: { rejectUnauthorized: false } // Aurora usually needs SSL
        });

        const [rows] = await conn.query("SELECT COUNT(*) as count FROM agencies");
        await conn.end();

        res.status(200).json({ ok: true, count: rows[0].count });

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: err.message });
    }
}
