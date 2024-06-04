const pool = require('../db');
const queries = require('../queries/userQueries');

const getUsers = (req, res) => {
    pool.query(queries.getUsers, (err, results)=>{
        if(err) throw err;
        res.status(200).json(results.rows);
    });
}

const getUser = (req, res)=>{
    const id = parseInt(req.params.id);
    pool.query(queries.getUser, [id], (err, results)=>{
        if(err) throw err;
        res.status(200).json(results.rows);
    })
}

const addUser = (req, res) =>{
    const {firstname, lastname, email} = req.body;
    console.log(req.body);
    pool.query(queries.checkEmailExists, [email], (err, results)=>{
        if(err) throw err;
        if(results.rows.length){
            res.send('Email already exists');
        } else{
            pool.query(queries.addUser, [firstname, lastname, email], (err, results)=>{
                if(err) throw err;
                res.send('Added user successfully');
            });
        }
    });
}

module.exports = {
    getUsers,
    getUser,
    addUser
}