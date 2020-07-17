const express = require('express');
const router = express.Router();


const ProgressCtrl = require('../controllers/progress')

router.get('/', ProgressCtrl.getProgress)
router.post('/', ProgressCtrl.postProgress)

module.exports = router;