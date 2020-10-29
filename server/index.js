const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');

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
// Default
app.get('/api/getZavezanci', (req, res) => {
    const getZavarovanci = "SELECT * FROM zavezanci WHERE racunovodstvo_id = ?";
    db.query(getZavarovanci, 1, (err, result) => {
        res.send(result);
    });
});

// Registriraj računovodstvo
app.post('/api/register', (req, res) => {

    const name = req.body.name;    
    const lastName = req.body.lastName;    
    const email = req.body.email;    
    const telSt = req.body.telSt;    
    const password = req.body.password;    
    const title = req.body.title;    
    const davcnaSt = req.body.davcnaSt;    
    const trr = req.body.trr;    
    const maticnaSt = req.body.maticnaSt;

    // Kriptiranje gesla
    const password_digest = bcrypt.hashSync(password, 10);

    const registerRacunovodstvo = "INSERT INTO racunovodstva (naziv_racunovodstva, davcna_st, trr, maticna_st, ime_lastnika, priimek_lastnika, tel_st_lastnika, email_lastnika, geslo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(registerRacunovodstvo, [title, davcnaSt, trr, maticnaSt, name, lastName, telSt, email, password_digest], (err, result) => {
        console.log(result);
    });
});

app.post('/api/login', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    const loginRacunovodstvo = "SELECT id FROM racunovodstva WHERE email_lastnika = ? AND geslo = ?";
    db.query(loginRacunovodstvo, [email, password], (err, result) => {
        if (err) res.send({err: err});

        if (result.length > 0) res.send(result);
        else res.send({message: "Napačna kombinacija emaila in gesla"});
    });

})

// Dodaj zavezanca
app.post('/api/insertZavezanec', (req, res) => {

    const racunovodstvoId = req.body.racunovodstvoId;
    const krajId = req.body.krajId;
    const nazivPodjetja = req.body.nazivPodjetja;
    const ime = req.body.ime;
    const priimek = req.body.priimek;
    const ulica = req.body.ulica;
    const hisnaSt = req.body.hisnaSt;
    const davcnaSt = req.body.davcnaSt;


    const insertZavarovanec = "INSERT INTO zavezanci (racunovodstvo_id, kraj_id, naziv_podjetja, ime, priimek, ulica, hisna_st, davcna_st) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
    db.query(insertZavarovanec, [racunovodstvoId, krajId, nazivPodjetja, ime, priimek, ulica, hisnaSt, davcnaSt], (err, result) => {
        console.log(result);
    });
});


// Listen on port 3001
app.listen(3001, () => {
    console.log('Running on port 3001');
});