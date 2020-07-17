const Profit = require('../models/profit');

exports.getProfit = function(req, res) {
  Profit.find({})
    .exec((errors, items) => {
      
      if (errors) {
        return res.status(422).send({errors});
      }

      return res.json(items);
    })
}
