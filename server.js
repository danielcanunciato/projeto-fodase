import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors'

const sql = sqlite3.verbose()
const app = express();
const port = process.env.PORT || 1830;

app.use(cors());
app.use(express.json());

const db = new sql.Database('./database/idiota.db', (err) => {
    if (err) {
        console.error("Error while trying to open the idiot database: ", err.message)
    } else {
        console.log("Connected successfully to the database.")
    }
})

db.run(`
    CREATE TABLE IF NOT EXISTS coisas_acho (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT NOT NULL
    )
`)

app.get('/idiota-api/coisas', (req, res) => {
    db.all('SELECT * FROM coisas_acho', (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message})
            return;
        }
        res.json(rows);
    })
})

app.post('/idiota-api/coisas/:data', async (req, res) => {
    const dataToInsert = req.params.data;

    if (!dataToInsert) {
        return res.status(400).send('No data provided to insert.')
    }

    const sql = `INSERT INTO coisas_acho (data) VALUES (?)`;
    db.run(sql, [dataToInsert], function(err) {
        if (err) {
            console.error("Error inserting data: ", err.message)
            res.status(500).send('Error inserting data.', err.message)
        } else {
            console.log(`A row has been inserted with rowid ${this.lastID}`)
            res.status(200).send(`Data "${dataToInsert}" inserted successfully with ID: ${this.lastID}`);
        }
    })
})

app.delete('/idiota-api/apagar_coisas', (req, res) => {
    db.run('DELETE FROM coisas_acho', function(err) {
        if (err) {
            console.error("Error cleaning up database: ", err.message);
            res.status(500).send('Error cleaning up database.');
        } else {
            res.status(200).send('Database cleaned up successfully.');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on PORT ${port}`)
})

export default app;