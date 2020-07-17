const express = require('express');
const router = express.Router();


const ItemCtrl = require('../controllers/items')

router.get('/', ItemCtrl.getItems)
router.post('/', ItemCtrl.postItem)
router.put('/:id', ItemCtrl.updateItem)
router.delete('/:id', ItemCtrl.deleteItem)

module.exports = router;