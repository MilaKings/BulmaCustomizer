const express = require('express');
const sassController = require('./controllers/sassController');
const router = express.Router();

router.get('/', (req, res) => { res.render('index') });

router.post('/compile-sass', sassController.compileSass);
router.post('/save', sassController.saveToDatabase); 

module.exports = router;



