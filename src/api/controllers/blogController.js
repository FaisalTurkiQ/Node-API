const asyncHandler = require('express-async-handler');
const Blog = require('../models/blogModel');

// Create Blog
exports.createBlog = asyncHandler(async (req, res,next) => {
  try {
    const { title, content, author } = req.body;
    const blog = await Blog.create({ title, content, author });
    res.sendData({item: blog}, 'Blog created successfully');
  } catch (error) {
    next(error)
  }
});

// Read Blog by ID
exports.getBlog = asyncHandler(async (req, res,next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.sendError({
          code: 404,
          message: 'Blog not found',
      }, 404);
    }
    res.sendData({item: blog}, 'Blog found successfully');
  } catch (error) {
    next(error)
  }
});

// Update Blog
exports.updateBlog = asyncHandler(async (req, res,next) => {
  try {
    const { title, content, author } = req.body;
    const blog = await Blog.findByIdAndUpdate(req.params.id, { title, content, author }, { new: true });
    if (!blog) {
      return res.sendError({
          code: 404,
          message: 'Blog not found',
      }, 404);
    }
    res.sendData({item: blog}, 'Blog updated successfully');
  } catch (error) {
    next(error)
  }
});

// Delete Blog
exports.deleteBlog = asyncHandler(async (req, res,next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.sendError({
          code: 404,
          message: 'Blog not found',
      }, 404);
    }
    res.sendData({}, 'Blog deleted successfully');
  } catch (error) {
    next(error)
  }
});

// List all Blogs
exports.listBlogs = asyncHandler(async (req, res,next) => {
  try {
    const blogs = await Blog.find({});
    res.sendData({items: blogs}, 'Blog list successfully');
  } catch (error) {
    next(error)
  }
});
