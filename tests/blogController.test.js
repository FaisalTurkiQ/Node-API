const request = require('supertest');
const express = require('express');
const Blog = require('../src/api/models/blogModel');

const app = express();
app.use(express.json());

app.use(require('../src/handlers/responseHandler'));
app.use('/api/blogs', require('../src/api/routes/blogRoute'));

jest.mock('../src/api/models/blogModel');

describe('Blog Controller', () => {
  describe('POST /api/blogs', () => {
    it('should create a blog and return 200', async () => {
      const blogData = { title: 'Test Blog', content: 'Test Content', author: 'Author' };
      Blog.create.mockResolvedValue(blogData);

      const response = await request(app).post('/api/blogs').set('Authorization', `Bearer ${validAdminToken}`).send(blogData);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.item).toEqual(blogData);
      expect(response.body.data.length).toBe(1);
      expect(response.body.message).toEqual('Blog created successfully');
    });

    it('should return 500 if the database throws an error', async () => {
      Blog.create.mockRejectedValue(new Error('Failed to create blog'));
      const blogData = { title: 'Test Blog', content: 'Test Content', author: 'Author' };

      const response = await request(app).post('/api/blogs').send(blogData);
      expect(response.statusCode).toBe(500);
    });
  });

  describe('GET /api/blogs/:id', () => {
    it('should retrieve a blog and return 200', async () => {
      const blogData = { _id: '1', title: 'Existing Blog', content: 'Content', author: 'Author' };
      Blog.findById.mockResolvedValue(blogData);

      const response = await request(app).get(`/api/blogs/${blogData._id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.item).toEqual(blogData);
      expect(response.body.message).toEqual('Blog found successfully');
    });

    it('should return 404 when blog is not found', async () => {
      Blog.findById.mockResolvedValue(null);

      const response = await request(app).get('/api/blogs/1');
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toEqual('Blog not found');
    });
  });

  describe('PUT /api/blogs/:id', () => {
    it('should update a blog and return 200', async () => {
      const blogData = { _id: '1', title: 'Updated Blog', content: 'Updated Content', author: 'Author' };
      Blog.findByIdAndUpdate.mockResolvedValue(blogData);

      const response = await request(app).put('/api/blogs/1').send(blogData);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.item).toEqual(blogData);
      expect(response.body.message).toEqual('Blog updated successfully');
    });

    it('should return 404 when trying to update a non-existing blog', async () => {
      Blog.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app).put('/api/blogs/1').send({ title: 'New Title' });
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toEqual('Blog not found');
    });
  });

  describe('DELETE /api/blogs/:id', () => {
    it('should delete a blog and return 200', async () => {
      const blogData = { _id: '1' };
      Blog.findByIdAndDelete.mockResolvedValue(blogData);

      const response = await request(app).delete(`/api/blogs/${blogData._id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toEqual('Blog deleted successfully');
    });

    it('should return 404 when trying to delete a non-existing blog', async () => {
      Blog.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app).delete('/api/blogs/1');
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toEqual('Blog not found');
    });
  });

  describe('GET /api/blogs', () => {
    it('should list all blogs and return 200', async () => {
      const blogs = [
        { title: 'Blog 1', content: 'Content 1', author: 'Author 1' },
        { title: 'Blog 2', content: 'Content 2', author: 'Author 2' }
      ];
      Blog.find.mockResolvedValue(blogs);

      const response = await request(app).get('/api/blogs');
      expect(response.statusCode).toBe(200);
      expect(response.body.data.items.length).toBe(blogs.length);
      expect(response.body.data.items).toEqual(blogs);
      expect(response.body.message).toEqual('Blog list successfully');
    });

    it('should return 500 if there is a server error while fetching blogs', async () => {
      Blog.find.mockRejectedValue(new Error('Server error'));

      const response = await request(app).get('/api/blogs');
      expect(response.statusCode).toBe(500);
    });
  });
});
