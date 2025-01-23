const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: {type: String,required: true,},
  description: {type: String,required: true,},
  image: {type: String,required: true,},
  isMain: {type: Boolean,default: false,},
});

module.exports = mongoose.model('Character', characterSchema);



