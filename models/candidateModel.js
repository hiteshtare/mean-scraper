var mongoose = require('mongoose');

var candidateSchema = mongoose.Schema({
  sr_no: {
    type: Number,
    require: true
  },
  registration_no: {
    type: String,
    require: true
  },
  full_name: {
    type: String,
    require: true
  }
});

const Candidate = module.exports = mongoose.model('Candidate', candidateSchema);

module.exports.addCandidate = function (newCandidate, callback) {
  newCandidate.save(callback);
}