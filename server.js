const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const app = express();
const mysql = require('mysql2');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
// parsing data
app.use(express.urlencoded({ extended: true }));  // To parse form data
app.use(express.json()); // To parse JSON data


app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
    // return res.send('Hello World!');
});
app.get('/Sign_Up', (req, res) => {
    res.render('Sign_Up', { title: 'Signup' });
});
app.get('/Login', (req, res) => {
    res.render('Login', { title: 'Login' });
});
dotenv.config(); // load env variables from config.env file
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(cors());
app.use(express.json());   // data acces in json from client side
app.use(morgan('dev'));
app.get("api/v1/test", require('./routes/testroutes'));
//sql connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.post('/Sign_Up', async (req, res) => {
    console.log(req.body);
    const { username, email, password, confirm } = req.body;


    // Check if passwords match
    if (password !== confirm) {
        return res.status(400).send("Passwords do not match");
    }

    try {
        const id = uuidv4(); // Generate a UUID
        const saltRounds = 12; // Recommended 10-12 rounds
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash password

        const sql = 'INSERT INTO sign_up_details (id, fullname, email, password) VALUES (?, ?, ?, ?)';
        db.query(sql, [id, username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).send('Error inserting data');
            }
            res.redirect('/Login');
        });

    } catch (err) {
        console.error('Error hashing password:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/Login', (req, res) => {
    const { username, password } = req.body;
    console.log('Login Request:', req.body);

    const sql = 'SELECT * FROM sign_up_details WHERE fullname = ?';
    db.query(sql, [username], async (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (result.length === 0) {
            console.log('No user found with fullname:', username);
            return res.status(401).send('Invalid username or password');
        }

        const user = result[0];
        console.log('Database User:', user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(401).send('Invalid username or password');
        }

        console.log('Login success for:', username);
        res.redirect('/main');
    });
});

app.get('/main', (req, res) => {
    let q = "SELECT * FROM dishes";
    db.query(q, (err, result) => {
        if (err) {
            console.error('Error fetching dishes:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.render('main', { dishes: result });
    });
});
//order button click

app.get("/show/:title", (req, res) => {
    let { title } = req.params;
    console.log("Title received:", title);

    let q = "SELECT * FROM dishes WHERE title = ?";

    db.query(q, [title], (err, result) => {
        if (err) {
            console.log("Error:", err);
            return res.status(500).send("Internal Server Error");
        }

        console.log("Result:", result);
        res.render("show.ejs", { result: result });
    });
});



app.get("/place/:title/:price", (req, res) => {
    let { title, price } = req.params;
    let { qty } = req.query;
    let { address } = req.query;
    let tp = parseInt(price) * parseInt(qty);
    let order_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = "INSERT INTO detail (title, quantity, price,order_time,address) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [title, qty, tp, order_time, address], (err, result) => {
        if (err) {
            console.log("Database error:", err);
            return res.send("Something went wrong!");
        }

        let order = [{
            title: title,
            qty: qty,
            price: tp,
            order_time: order_time,
            address: address
        }];
        res.render("c.ejs", { order });
    });
});

app.post("/feedback", (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).send("All fields are required.");
    }

    const sql = "INSERT INTO feedback (name, email, fdbck) VALUES (?, ?, ?)";
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Internal Server Error");
        }

        res.render("thankyou.ejs"); // <- Show thank you page after saving
    });
});


app.get("/feedback", (req, res) => {
    res.render("feedback.ejs", { title: "message" });
});
app.get("/order-tracking", (req, res) => {
    res.render("order-tracking.ejs");
});
