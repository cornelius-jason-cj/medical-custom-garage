const Belanja = require('../models/belanja');

exports.getBelanja = function(req, res) {
  Belanja.find({})
    .exec((errors, items) => {
      
      if (errors) {
        return res.status(422).send({errors});
      }

      return res.json(items);
    })
}

exports.postBelanja = function(req, res) {
  console.log("exports.postItem -> req.body", req.body)

  const data = new Belanja({
    itemName: req.body.itemName,
    purchasePrice: req.body.purchasePrice,
  })
  console.log("exports.postItem -> data", data)

  data.save((err) => {
    if (err) return console.error(err);

    return res.status(201).send('Create Success');
  })

}