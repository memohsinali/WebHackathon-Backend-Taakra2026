import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Remove __v from JSON response
categorySchema.methods.toJSON = function () {
  const category = this.toObject();
  delete category.__v;
  return category;
};

const Category = mongoose.model('Category', categorySchema);

export default Category;
