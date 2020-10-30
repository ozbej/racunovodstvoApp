const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const { response } = require('express');

// Connect to DB
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'racunovodstva'
});

// Include some dependencies
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// *API endpoints*
app.get('/api/getZavezanci', (req, res) => {

    const { racunovodstvoId } = req.query; 

    console.log(racunovodstvoId)

    const getZavarovanci = "SELECT * FROM zavezanci WHERE racunovodstvo_id = ?";
    db.query(getZavarovanci, racunovodstvoId, (err, result) => {
        res.send(result);
    });
});

// Registriraj računovodstvo
app.post('/api/register', (req, res) => {

    const { name, lastName, email, telSt, password, title, davcnaSt, trr, maticnaSt } = req.body;

    // Kriptiranje gesla
    const password_digest = bcrypt.hashSync(password, 10);

    const registerRacunovodstvo = "INSERT INTO racunovodstva (naziv_racunovodstva, davcna_st, trr, maticna_st, ime_lastnika, priimek_lastnika, tel_st_lastnika, email_lastnika, geslo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(registerRacunovodstvo, [title, davcnaSt, trr, maticnaSt, name, lastName, telSt, email, password_digest], (err, result) => {
        console.log(result);
    });
});

app.post('/api/login', (req, res) => {

    const { email, password } = req.body;

    const loginRacunovodstvo = "SELECT * FROM racunovodstva WHERE email_lastnika = ?";
    db.query(loginRacunovodstvo, [email, password], (err, user, result) => {

        if (err) res.send({err: err});

        if (result.length > 0) {
            bcrypt.compare(password, user[0].geslo, (err, bRes) => {
                if (bRes) {
                    console.log(user[0].id)
                    res.json({"id": user[0].id});
                }
                else res.send({message: "Napačna kombinacija emaila in gesla"});
            })
        }
        else res.send({message: "Napačna kombinacija emaila in gesla"});
    });

})

// Dodaj zavezanca
app.post('/api/addZavezanec', (req, res) => {

    const { racunovodstvoId, krajId, nazivPodjetja, ime, priimek, ulica, hisnaSt, davcnaSt } = req.body;

    const insertZavarovanec = "INSERT INTO zavezanci (racunovodstvo_id, kraj_id, naziv_podjetja, ime, priimek, ulica, hisna_st, davcna_st) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
    db.query(insertZavarovanec, [racunovodstvoId, krajId, nazivPodjetja, ime, priimek, ulica, hisnaSt, davcnaSt], (err, result) => {
        console.log(result);
    });
});

// Pribodi vse kraje
app.get('/api/getKraji', (req, res) => {
    const getZavarovanci = "SELECT * FROM kraji ORDER BY ime";
    db.query(getZavarovanci, 1, (err, result) => {
        res.send(result);
    });
});


// Listen on port 3001
app.listen(3001, () => {
    console.log('Running on port 3001');
});