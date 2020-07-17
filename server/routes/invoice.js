const express = require('express');
const router = express.Router();
const InvoiceCtrl = require('../controllers/invoice')
const AuthCtrl = require('../controllers/auth')

router.get('/', InvoiceCtrl.getInvoice)
router.post('/', InvoiceCtrl.postInvoice)
router.get('/secret', AuthCtrl.onlyAuthUser, InvoiceCtrl.getSecret)
router.put('/:id', InvoiceCtrl.updateInvoice)

module.exports = router;