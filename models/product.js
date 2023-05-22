const mongoose = require('mongoose');
const { BOOLEAN } = require('sequelize');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  species: {
    type: String,

  },
  breed: {
    type: String,
    required: true
  },
  gender: {
    type: String,
 
  },
  location: {
    type: String,
  
  },
  birthday: {
    type: String,
 
  },
  price: {
    type: Number,
    required: true
  },
  desex:{
    type: Boolean,
    required: true,
    default: false
  },
  vaccinate:{
    type: Boolean,
    required: true,
    default: false
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adoption: {
    type: Boolean,
    required: true,
    default: false
  }

});

module.exports = mongoose.model('Product', productSchema);

