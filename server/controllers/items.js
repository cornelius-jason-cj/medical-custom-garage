const Item = require('../models/items');

exports.getItems = function(req, res) {
  Item.find({})
    .exec((errors, items) => {
      
      if (errors) {
        return res.status(422).send({errors});
      }

      return res.json(items);
    })
}

exports.postItem = function(req, res) {
  const data = new Item({
    barcode: req.body.barcode,
    itemName: req.body.itemName,
    quantity: req.body.quantity,
    purchasePrice: req.body.purchasePrice,
    sellingPrice: req.body.sellingPrice
  })

  data.profitPrice = parseInt(data.sellingPrice)-parseInt(data.purchasePrice)
  data.purchasePrice = new Intl.NumberFormat().format(data.purchasePrice)
  data.sellingPrice = new Intl.NumberFormat().format(data.sellingPrice)
  data.profitPrice = new Intl.NumberFormat().format(data.profitPrice)

  data.save((err) => {
    if (err) return console.error(err);

    return res.status(201).send('Create Success');
  })

}

exports.updateItem = function(req, res) {
  const {id} = req.params;
  const data = {
    barcode: req.body.barcode,
    itemName: req.body.itemName,
    quantity: req.body.quantity,
    purchasePrice: req.body.purchasePrice,
    sellingPrice: req.body.sellingPrice,
    profitPrice: req.body.profitPrice,
    updatedAt: new Date()
  }
  
  data.purchasePrice = data.purchasePrice.replace(new RegExp('\\'+(1111).toLocaleString().replace(/1/g,''),'g'),'');
  data.sellingPrice = data.sellingPrice.replace(new RegExp('\\'+(1111).toLocaleString().replace(/1/g,''),'g'),'');
  data.profitPrice = parseInt(data.sellingPrice)-parseInt(data.purchasePrice)

  data.purchasePrice = new Intl.NumberFormat().format(data.purchasePrice)
  data.sellingPrice = new Intl.NumberFormat().format(data.sellingPrice)
  data.profitPrice = new Intl.NumberFormat().format(data.profitPrice)
  
  Item.updateOne({"_id":id}, {$set:data}, (err, result) => {
    if (err) return console.error(err);
    return res.status(201).send('Update Successful')
  });
}

exports.deleteItem = function(req, res) {
  const {id} = req.params

  Item.remove({_id: id}, function (err) {
    if (err) return console.error(err)

    return res.status(200).send('Delete Successful');
  })
}