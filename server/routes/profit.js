const express = require('express');
const router = express.Router();


const ProfitCtrl = require('../controllers/profit')

router.get('/', ProfitCtrl.getProfit)
module.exports = router;