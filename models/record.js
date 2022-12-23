const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const recordSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  doctor_name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date_of_actual_record: {
    type: String,
    required: true
  },
  record_of: {
    type: ObjectId,
    ref: "User",
    required: true
  }
}, {
  // will automatically give a timestamp of createdAt and updatedAt
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

mongoose.model("Record", recordSchema);