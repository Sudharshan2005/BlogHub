import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    category: {
      type: String,
      trim: true,
    },
    images: [
      {
        url: String,
        alt: String,
        caption: String,
      },
    ],
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,
    scheduledFor: Date,
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: {
      type: Number,
      default: 0,
    }, // Added comments field
    readTime: {
      type: Number,
      default: 1,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre('save', async function (next) {
  try {
    if (!this.title || !this.title.trim()) {
      return next(new Error('Title is required for slug generation'));
    }
    if (this.isModified('title')) {
      let slug = this.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      const existingBlog = await mongoose.models.Blog.findOne({ slug });
      if (existingBlog && existingBlog._id.toString() !== this._id.toString()) {
        const randomSuffix = Math.floor(Math.random() * 10000);
        slug = `${slug}-${randomSuffix}`;
      }
      this.slug = slug;
    }

    if (this.isModified('content')) {
      if (!this.content || !this.content.trim()) {
        return next(new Error('Content is required for read time calculation'));
      }
      const wordCount = this.content.split(/\s+/).length;
      this.readTime = Math.ceil(wordCount / 200);
    }

    if (this.isModified('published') && this.published && !this.publishedAt) {
      this.publishedAt = new Date();
    }

    next();
  } catch (error) {
    next(error as mongoose.CallbackError);
  }
});

blogSchema.index({
  title: 'text',
  tags: 'text',
  excerpt: 'text',
});

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);