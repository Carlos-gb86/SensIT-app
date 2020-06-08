const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
const validator = require('validator');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A project must have a name'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [40, 'The project name cannot have more than 40 characters'],
      minlength: [6, 'The project name must have at least 6 characters'],
      validate: [
        validator.isAscii,
        'project name must only contain ascii characters',
      ],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    users: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    public: Boolean,
    inspectionDates: [Date],
    slug: String,
    description: {
      type: String,
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      required: [true, 'A project must have a structural type'],
      trim: true,
      lowercase: true,
      maxlength: [25, 'The project type cannot have more than 25 characters'],
    },
    builtIn: {
      type: Number,
      required: [true, 'A project must have a year of construction'],
    },
    material: {
      type: String,
      required: [true, 'A project must have a main construction material'],
      lowercase: true,
      enum: {
        values: ['concrete', 'steel', 'timber', 'masonry', 'frp', 'other'],
        message:
          'The main construction material must be one of the following: Concrete, Steel, Timber, Masonry, FRP or Other',
      },
    },
    owner: {
      type: String,
      trim: true,
      lowercase: true,
    },
    condition: {
      type: Number,
      default: 5,
      min: [1, 'Condition cannot be less than 1'],
      max: [5, 'Condition cannot be more than 5'],
      set: (val) => Math.round(val),
    },
    bimModel: {
      type: String,
    },
    sensors: [Object],
    thumbnail: {
      type: String,
      default: 'thumbnail-placeholder.png',
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    location: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: {
        type: [Number], //First Lng and then Lat
        required: [
          true,
          'A project must have a longitude and latitude coordinates',
        ],
      },
      city: {
        type: String,
        trim: true,
        lowercase: true,
      },
      country: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// // projectSchema.index({ price: 1 });
// projectSchema.index({ price: 1, ratingsAverage: -1 });
// projectSchema.index({ slug: 1 });
// projectSchema.index({ startLocation: '2dsphere' });

// projectSchema.virtual('durationWeeks').get(function () {
//   return Math.round((this.duration / 7) * 100) / 100;
// });

// //Virtual populate
// projectSchema.virtual('reviews', {
//   ref: 'Review',
//   foreignField: 'project',
//   localField: '_id',
// });

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
projectSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const project = mongoose.model('Project', projectSchema);

module.exports = project;
