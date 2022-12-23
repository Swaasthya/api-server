const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Record = mongoose.model('Record');
const requireLogin = require('../middlewares/requireLogin');

router.post('/addRecord', requireLogin, (req, res) => {
  const { title, description, doctor_name, location, date_of_actual_record } = req.body;
  if (!title || !description || !doctor_name || !location || !date_of_actual_record) {
    return res.status(422).json({ error: 'Please fill all the details to proceed!' });
  }
  const record = new Record({
    title: title,
    description: description,
    doctor_name: doctor_name,
    location: location,
    date_of_actual_record: date_of_actual_record,
    record_of: req.user
  })

  record.save().then((result) => {
    res.json({ record: result })
  })
    .catch((err) => {
      console.error("Record save error: " + err)
    })
})

router.get("/allRecords", requireLogin, (req, res) => {
  Record.find({ record_of: req.user._id })
    .sort({ created_at: -1 })
    .then((record) => {
      console.log("Record fetch success: " + record);
      res.json({ record });
    })
    .catch((err) => {
      console.error("Record fetch error: " + err);
    })
})

router.delete("/deleteRecord/:recordId", requireLogin, (req, res) => {
  Record.findByIdAndRemove(req.params.recordId)
    .then(record => {
      if (!record) {
        return res.status(422).json({ error: 'Record not found' });
      }
      else {
        res.json({ record: record });
      }
    })
    .catch(err => {
      console.err("error:", err);
    })
})

module.exports = router;