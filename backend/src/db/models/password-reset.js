import mongoose from 'mongoose'

const PasswordResetTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expireAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

PasswordResetTokenSchema.index({ token: 1 }, { background: true })
PasswordResetTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.model('PasswordResetToken', PasswordResetTokenSchema)
