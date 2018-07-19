'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

module.exports = async (fastify, options) => {
  const db = fastify.mongo
  const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  })
  UserSchema.pre('save', async function (next) {
    try {
      const hash = await bcrypt.hash(this.password, 10)
      this.password = hash
      next()
    } catch (err) {
      console.log(err)
    }
  })
  db.model('User', UserSchema)
}
