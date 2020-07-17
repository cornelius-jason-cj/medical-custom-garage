const Progress = require('../models/progress');

exports.getProgress = (req, res) => {
  Progress.find({})
    .exec((errors, progress) => {

      if (errors) {
        return res.status(422).send(errors);
      }

      return res.json(progress)
    })
}


exports.postProgress = (req, res) => {
  const data = new Progress({
    customerName: req.body.customerName,
    notes: req.body.notes
  })

  data.save((err) => {
    if (err) return console.error(err);
    return res.status(201).send('New Job Create Success');
  })

}