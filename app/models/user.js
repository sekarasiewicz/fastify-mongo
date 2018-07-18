'use strict'

const fastifyPlugin = require('fastify-plugin')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

async function user (fastify, options) {
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
  const User = db.model('User', UserSchema)

  fastify.decorate('User', User, ['mongo'])
}

module.exports = fastifyPlugin(user)
