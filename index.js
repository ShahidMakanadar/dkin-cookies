const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors')

//express runnig setUp or intigration
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: 'http://127.0.0.1:5500',

}));

const db = new sqlite3.Database('orders.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the orders database.');

        db.run(`CREATE TABLE IF NOT EXISTS orders (
            name TEXT,
            email TEXT
        )`);
    }
});


// Order Place Api 
app.post('/submitOrder', (req, res) => {
    const {name, email}= req.body;
    console.log(name, email) 

    const sql = `INSERT INTO orders (name, email) VALUES (?, ?)`;

    db.run(sql, [name, email], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message }); 
        }
        res.json({ message: 'Order received and saved to database successfully' });
        console.log("done...............")
    });
});

// get all Order Api 
app.get('/getOrders', (req, res) => {
    const sql = 'SELECT * FROM orders';

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message }); 
        }
        res.json({ orders: rows }); 
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});