import mongoose from 'mongoose';

const competitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a category'],
    },
    venue: {
      type: String,
      required: [true, 'Please provide a venue'],
      trim: true,
    },
    building: {
      type: String,
      trim: true,
      default: '',
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date'],
    },
    dayNumber: {
      type: Number,
      required: [true, 'Please provide a day number'],
      min: 1,
      max: 5,
    },
    registrationsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
competitionSchema.index({ category: 1 });
competitionSchema.index({ startDate: 1 });
competitionSchema.index({ dayNumber: 1 });
competitionSchema.index({ registrationsCount: -1 });

// Virtual for checking if competition is upcoming
competitionSchema.virtual('isUpcoming').get(function () {
  return this.startDate > new Date();
});

// Remove __v from JSON response
competitionSchema.methods.toJSON = function () {
  const competition = this.toObject({ virtuals: true });
  delete competition.__v;
  delete competition.id;
  return competition;
};

const Competition = mongoose.model('Competition', competitionSchema);

export default Competition;
