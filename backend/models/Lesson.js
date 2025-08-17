const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxlength: [100, 'Lesson title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Lesson description is required'],
    trim: true,
    maxlength: [500, 'Lesson description cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Lesson content is required'],
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Lesson duration is required'],
    min: [1, 'Lesson duration must be at least 1 minute']
  },
  order: {
    type: Number,
    default: 0
  },
  media: {
    type: String, // URL to video/audio file
    default: null
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'doc', 'video', 'link', 'other'],
      default: 'other'
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
lessonSchema.index({ courseId: 1, order: 1 });
lessonSchema.index({ createdBy: 1 });

// Virtual for formatted duration
lessonSchema.virtual('formattedDuration').get(function() {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
});

// Pre-save middleware to ensure order is unique within course
lessonSchema.pre('save', async function(next) {
  if (this.isModified('order')) {
    const existingLesson = await this.constructor.findOne({
      courseId: this.courseId,
      order: this.order,
      _id: { $ne: this._id }
    });
    
    if (existingLesson) {
      // Find the next available order
      const maxOrder = await this.constructor
        .findOne({ courseId: this.courseId })
        .sort({ order: -1 })
        .select('order');
      
      this.order = (maxOrder?.order || 0) + 1;
    }
  }
  next();
});

module.exports = mongoose.model('Lesson', lessonSchema);
