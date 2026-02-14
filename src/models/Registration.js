import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: [true, 'Competition is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate registrations
registrationSchema.index({ user: 1, competition: 1 }, { unique: true });

// Index for better query performance
registrationSchema.index({ status: 1 });
registrationSchema.index({ createdAt: -1 });

// Remove __v from JSON response
registrationSchema.methods.toJSON = function () {
  const registration = this.toObject();
  delete registration.__v;
  return registration;
};

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
