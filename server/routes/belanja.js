const express = require('express');
const router = express.Router();


const BelanjaCtrl = require('../controllers/belanja')

router.get('/', BelanjaCtrl.getBelanja)
router.post('/', BelanjaCtrl.postBelanja)

module.exports = router;