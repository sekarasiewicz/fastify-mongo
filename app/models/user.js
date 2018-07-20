const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

module.exports = async (fastify) => {
  const { mongo } = fastify;
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
  });
  UserSchema.pre('save', async (next) => {
    try {
      const hash = await bcrypt.hash(this.password, 10);
      this.password = hash;
      next();
    } catch (err) {
      fastify.log(err);
    }
  });
  mongo.model('User', UserSchema);
};
